// components/VideoPlayer.js
import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import { ActivityIndicator, View } from 'react-native';

export const VideoPlayer = ({ url, onError }) => {
  const videoRef = useRef(null);
  const [hlsInitialized, setHlsInitialized] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    if (!url || hlsInitialized || !videoRef.current) return;

    const initPlayer = async () => {
      if (Hls.isSupported()) {
        try {
          const hls = new Hls({
            // xhrSetup: (xhr) => {
            //   xhr.setRequestHeader('User-Agent', 'Mozilla/5.0');
            //   xhr.setRequestHeader('Referer', 'https://monoschino2.com');
            // },
            // Increase buffer size and timeout for better stability
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            maxBufferSize: 60 * 1000 * 1000, // 60MB
            maxBufferHole: 0.5,
            lowLatencyMode: false,
          });

          hls.loadSource(url);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS Manifest parsed successfully');
            videoRef.current.play().catch((e) => {
              // Handle autoplay restrictions
              console.log('Autoplay prevented:', e);
            });
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.log('HLS error:', data.type, data.details);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log('Network error, trying to recover...');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log('Media error, trying to recover...');
                  hls.recoverMediaError();
                  break;
                default:
                  console.error('Fatal error, cannot recover:', data);
                  hls.destroy();
                  onError(data);
                  break;
              }
            }
          });

          setHlsInitialized(true);

          return () => {
            hls.destroy();
          };
        } catch (error) {
          console.error('HLS init error:', error);
          onError(error);
        }
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari which has native HLS support
        videoRef.current.src = url;
        setHlsInitialized(true);
      } else {
        console.error('HLS not supported in this browser');
        onError({ message: 'HLS not supported in this browser' });
      }
    };

    initPlayer();
  }, [url, onError]);

  // In your VideoPlayer component
  useEffect(() => {
    const handleOnline = () => {
      console.log('Connection restored, reloading video');
      if (videoRef.current && !hlsInitialized) {
        // Reinitialize player when connection is restored
        initPlayer();
      }
    };

    const handleOffline = () => {
      console.log('Connection lost');
      // Maybe show a user-friendly message
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <View>
      <video
        ref={videoRef}
        controls
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onError={(e) => {
          console.error('HTML5 video error:', e);
          onError(e);
        }}
      />
      {isBuffering && (
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
          <ActivityIndicator size="large" color="#CF9FFF" />
        </View>
      )}
    </View>
  );
};
