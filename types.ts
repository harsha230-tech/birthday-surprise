
export enum AppState {
  INTRO = 'INTRO',
  INTERACT_CONFIRM = 'INTERACT_CONFIRM',
  MUSIC_PLAY = 'MUSIC_PLAY',
  LIGHT_ON = 'LIGHT_ON',
  PHOTO_REVEAL = 'PHOTO_REVEAL',
  DECORATE = 'DECORATE',
  FIREWORK = 'FIREWORK',
  CAKE = 'CAKE',
  MESSAGE = 'MESSAGE',
  REPLY = 'REPLY',
  CHAT = 'CHAT'
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'recipient';
  timestamp: Date;
}

export interface HeartProps {
  id: number;
  left: string;
  duration: string;
  size: string;
  delay: string;
}
