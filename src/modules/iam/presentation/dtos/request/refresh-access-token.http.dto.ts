import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshAccessTokenHttpDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}

