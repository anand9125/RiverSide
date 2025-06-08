import * as mediasoup from "mediasoup";
import { Router, RtpCapabilities, Worker } from 'mediasoup/types'

export const createMediasoupWorker = async () => {
  return await mediasoup.createWorker({
    logLevel: 'warn', 
    logTags: [   
                'info',
                'ice',
                'dtls',
                'rtp',
                'srtp',
                'rtcp'
            ],
    rtcMinPort: 20000,
    rtcMaxPort: 30000,
  })
}

export async function createRouter(worker: Worker) {
  return await worker.createRouter({
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
            'x-google-start-bitrate': 1000   //Helps browsers start sending at 1000 kbps.
        }
      },
    ] ,
  });
}

export const createWebRtpTranport = async (mediasoupRouter:Router)=>{
    const maxIncomingBitrate = 1000000;
    const initialAvailableOutgoingBitrate = 1000000;
    const transport = await mediasoupRouter.createWebRtcTransport({
        listenIps:[{
            ip: '0.0.0.0',
            announcedIp: '127.0.0.1'
        }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate,    //Initial available bitrate for outgoing media.
       
    })
    if(maxIncomingBitrate){
        try{
            await transport.setMaxIncomingBitrate(maxIncomingBitrate);
        }
        catch(err){
            console.log(err)
        }
    }
    return {
        transport,
        params:{
            id:transport.id,
            iceParameters:transport.iceParameters,
            iceCandidates:transport.iceCandidates,
            dtlsParameters:transport.dtlsParameters,

        }
    }
}