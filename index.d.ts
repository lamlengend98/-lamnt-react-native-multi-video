import * as React from 'react';
import { LoadError } from 'react-native-video';

export interface VideoProperties {
  /**
   * Configurable props
   */
  loadingComponent?: React.Component
  autoPlay?: boolean;
  autoPlayNextVideo?: boolean;
  controlTimeout?: number;
  data: [{ uri: string; title?: string }];
  defaultVideoIndex?: number;
  fullscreenOrientation?: 'all' | 'landscape' | 'portrait';
  loop?: 'all' | 'one' | 'none';
  poster?: string;
  posterResizeMode?: "stretch" | "contain" | "cover" | "none"; // via Image#resizeMode
  rate?: number;
  delay?: number;
  resizeMode?: "stretch" | "contain" | "cover" | "none"; // via Image#resizeMode
  showBottomProgresssBar?: boolean;
  showLockOrientationIcon?: boolean;
  pause?: boolean;
  noBackButton?: boolean;
  prevNextTime?: boolean;
  /**
   * Event props
   */
  onBack?(): void;
  onEnd?(): void;
  onLoad?(event): void;
  onLoadStart?(event): void;
  onPause?(): void;
  onPlay?(): void;
  onPressFullscreen?(): void;
  onError?(error: LoadError): void;
  onPlayingVideo?({ currentTime, playableDuration, seekableDuration }): void;
}

export default class VideoPlayer extends React.Component<VideoProperties> {

}
