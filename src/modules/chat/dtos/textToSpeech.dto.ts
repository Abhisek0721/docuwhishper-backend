import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TextToSpeechDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  voiceId: string;

  @IsString()
  @IsOptional()
  modelId?: string;
}
