import {create} from "zustand"

import axios from "axios"
import { API_URL } from "../config"
interface RoomStore {
    roomId:string|null
    isLoading:boolean
    createRoom:(title:string,scheduledFor:string,hostUserId:string)=>Promise<any>
}


// store/useRoomStore.ts
export const useRoomStore = create<RoomStore>((set) => ({
  roomId: null,
  isLoading: false,
  createRoom: async (title, scheduledFor, hostUserId) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/user/create-room`, {
        title,
        scheduledFor,
        hostUserId,
      });
      const roomId = res.data.room.id;
      set({ roomId, isLoading: false });
      return roomId;
    } catch (e: any) {
      set({ isLoading: false });
      return null;
    }
  },
}));
