import { Injectable } from '@angular/core';
import { TokenData, TokenInfo } from '@mdz/models';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class TokenStorageService {
  private REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
  private AUTHENTIFICATION_TOKEN_KEY = 'AUTHENTIFICATION_TOKEN';

  constructor(private localStorageService: LocalStorageService) {}

  public clearTokens() {
    this.updateTokens({
      authentificationToken: null,
      refreshToken: null
    });
  }

  /**
   *
   * @param tokens
   */
  public updateTokens(tokens: TokenInfo) {
    if (tokens == null) {
      tokens = new TokenInfo();
    }

    if (tokens.refreshToken === null) {
      this.localStorageService.removeItem(this.REFRESH_TOKEN_KEY);
      this.localStorageService.removeItem(this.AUTHENTIFICATION_TOKEN_KEY);
    } else {
      this.localStorageService.setItem(
        this.REFRESH_TOKEN_KEY,
        tokens.refreshToken
      );
      this.localStorageService.setItem(
        this.AUTHENTIFICATION_TOKEN_KEY,
        tokens.authentificationToken
      );
    }
  }

  public getAuthentificationToken(): string {
    return this.localStorageService.getItem(this.AUTHENTIFICATION_TOKEN_KEY);
  }

  public getRefreshToken(): string {
    return this.localStorageService.getItem(this.REFRESH_TOKEN_KEY);
  }
}
