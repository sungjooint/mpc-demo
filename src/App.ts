import { RtcPairSocket } from 'rtc-pair-socket';

export default class App {
  socket?: RtcPairSocket;
  party?: 'alice' | 'bob';

  generateJoiningCode() {
    // 128 bits of entropy
    return [
      Math.random().toString(36).substring(2, 12),
      Math.random().toString(36).substring(2, 12),
      Math.random().toString(36).substring(2, 7),
    ].join('');
  }

  async host(_code: string) {
    // this.party = 'alice';
    // const socket = new RtcPairSocket(code, 'alice');
    // this.socket = socket;

    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    // await new Promise<void>((resolve, reject) => {
    //   socket.on('open', resolve);
    //   socket.on('error', reject);
    // });
  }

  async join(_code: string) {
    // this.party = 'bob';
    // const socket = new RtcPairSocket(code, 'bob');
    // this.socket = socket;

    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    // await new Promise<void>((resolve, reject) => {
    //   socket.on('open', resolve);
    //   socket.on('error', reject);
    // });
  }

  async mpcLargest(_myNumber: number) {
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    return 42;
  }
}
