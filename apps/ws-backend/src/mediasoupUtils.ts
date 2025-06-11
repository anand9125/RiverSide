import { Worker, Router, WebRtcTransport } from 'mediasoup/types';
import * as mediasoup from 'mediasoup';

export async function createMediasoupWorker(): Promise<Worker> {
  console.log('🏗️ Creating mediasoup worker...');
  
  const worker = await mediasoup.createWorker({
    logLevel: 'debug',
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
      'rtx',
      'bwe',
      'score',
      'simulcast',
      'svc'
    ],
  });

  worker.on('died', () => {
    console.error('❌ Mediasoup worker died, exiting in 2 seconds...');
    setTimeout(() => process.exit(1), 2000);
  });

  console.log('✅ Mediasoup worker created');
  return worker;
}

export async function createRouter(worker: Worker): Promise<Router> {
  console.log('🛤️ Creating mediasoup router...');
  
  const mediaCodecs = [
    {
      kind: 'audio' as const,
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: 'video' as const,
      mimeType: 'video/VP8',
      clockRate: 90000,
      parameters: {
        'x-google-start-bitrate': 1000,
      },
    },
    {
      kind: 'video' as const,
      mimeType: 'video/VP9',
      clockRate: 90000,
      parameters: {
        'profile-id': 2,
        'x-google-start-bitrate': 1000,
      },
    },
    {
      kind: 'video' as const,
      mimeType: 'video/h264',
      clockRate: 90000,
      parameters: {
        'packetization-mode': 1,
        'profile-level-id': '4d0032',
        'level-asymmetry-allowed': 1,
        'x-google-start-bitrate': 1000,
      },
    },
    {
      kind: 'video' as const,
      mimeType: 'video/H264',
      clockRate: 90000,
      parameters: {
        'packetization-mode': 1,
        'profile-level-id': '42e01f',
        'level-asymmetry-allowed': 1,
        'x-google-start-bitrate': 1000,
      },
    },
  ];

  const router = await worker.createRouter({ mediaCodecs });
  console.log('✅ Mediasoup router created');
  return router;
}

export async function createWebRtpTranport(router: Router) {
  console.log('🚛 Creating WebRTC transport...');
  
  const webRtcTransportOptions = {
    listenIps: [
      {
        ip: '0.0.0.0',
        announcedIp: '127.0.0.1', // Replace with your server's public IP in production
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate: 1000000,
    minimumAvailableOutgoingBitrate: 600000,
    maxSctpMessageSize: 262144,
    maxIncomingBitrate: 1500000,
  };

  const transport = await router.createWebRtcTransport(webRtcTransportOptions);

  transport.on('dtlsstatechange', (dtlsState) => {
    console.log('🔐 DTLS state change:', dtlsState);
    if (dtlsState === 'closed') {
      transport.close();
    }
  });

  transport.on('icestatechange', (iceState) => {
    console.log('🧊 ICE state change:', iceState);
  });

  const params = {
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
  };

  console.log('✅ WebRTC transport created:', transport.id);
  return { transport, params };
}