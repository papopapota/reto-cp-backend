export interface MovieWithShowtimesResponse {
  id: string;
  title: string;
  synopsis: string;
  duration: number;
  genre: string;
  rating: string;
  showtimes?: {
    id: string;
    room: string;
    dateTime: Date;
    price: number;
    availableSeats: number;
  }[];
}