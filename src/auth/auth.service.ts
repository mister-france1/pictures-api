import { Injectable } from '@nestjs/common';
import {
    AuthenticationDetails, CognitoAccessToken, CognitoIdToken, CognitoRefreshToken,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { ConfigService } from '@nestjs/config';
import { RegisterRequestDto } from './dto/register.request.dto';
import { AuthenticateRequestDto } from './dto/authenticate.request.dto';

interface Tokens {
    IdToken: string;
    RefreshToken: string;
    AccessToken: string;
}

@Injectable()
export class AuthService {
    private userPool: CognitoUserPool;

    constructor(private configService: ConfigService) {
        this.userPool = new CognitoUserPool({
            UserPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
            ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
        });
    }

    async register(authRegisterRequest: RegisterRequestDto) {
        const {name, email, password} = authRegisterRequest;
        return new Promise((resolve, reject) => {
            return this.userPool.signUp(
                name,
                password,
                [new CognitoUserAttribute({Name: 'email', Value: email})],
                null,
                (err, result) => {
                    if (!result) {
                        reject(err);
                    } else {
                        resolve(result.user);
                    }
                },
            );
        })
        .then(() => {
            return this.authenticate({name, password});
        });
    }

    async authenticate(user: AuthenticateRequestDto) {
        const {name, password} = user;
        const authenticationDetails = new AuthenticationDetails({
            Username: name,
            Password: password,
        });
        const userData = {
            Username: name,
            Pool: this.userPool,
        };
        const newUser = new CognitoUser(userData);
        return new Promise((resolve, reject) => {
            return newUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    resolve(result);
                },
                onFailure: (err) => {
                    reject(err);
                },
            });
        });
    }

    async logout(username: string, {IdToken, RefreshToken, AccessToken}: Tokens): Promise<string> {
        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: this.userPool
        });

        const session = new CognitoUserSession({
            IdToken: new CognitoIdToken({ IdToken: IdToken }),
            RefreshToken: new CognitoRefreshToken({ RefreshToken }),
            AccessToken: new CognitoAccessToken({ AccessToken: AccessToken })
        });

        cognitoUser.setSignInUserSession(session);

        return new Promise((resolve, reject) => {
            cognitoUser.globalSignOut({
                onSuccess: () => {
                    resolve('success');
                },
                onFailure: (error: Error) => {
                    reject(error);
                },
            });
        });
    }
}
