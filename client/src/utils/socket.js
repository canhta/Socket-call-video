import io from 'socket.io-client';
import { HOST } from '../configs/configs';

const socket = io(HOST);
export default socket;
