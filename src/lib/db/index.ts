import Dexie, { type Table } from 'dexie';

export interface LocalMessage {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  space_id: string;
  channel_id?: string | null;
  conversation_id?: string | null;
  is_edited?: boolean;
  thread_id?: string | null;
  file_url?: string | null;
  file_type?: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  reactions?: {
    emoji: string;
    user_id: string;
  }[];
  // Offline sync fields
  status: 'sent' | 'pending' | 'error';
  temp_id?: string;
}

export interface LocalConversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  other_user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface LocalChannel {
  id: string;
  name: string;
  slug: string;
  space_id: string;
  description: string | null;
}

export class ChatterboxDB extends Dexie {
  messages!: Table<LocalMessage>;
  conversations!: Table<LocalConversation>;
  channels!: Table<LocalChannel>;

  constructor() {
    super('ChatterboxDB');
    this.version(1).stores({
      messages: 'id, channel_id, conversation_id, space_id, created_at, status',
      conversations: 'id, last_message_at',
      channels: 'id, space_id, slug'
    });
  }
}

export const db = new ChatterboxDB();
