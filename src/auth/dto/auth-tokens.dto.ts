export class AuthTokensDto {
  access_token!: string;
  refresh_token!: string;
  data!: {
    id: string;
    email: string;
    role: string;
    profile: {
      firstName?: string | null;
      lastName?: string | null;
      avatarUrl?: string | null;
      phone?: string | null;
    } | null;
  };
}
