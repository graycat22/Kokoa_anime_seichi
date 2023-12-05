import { createClient } from "@supabase/supabase-js";

export type Database = {
  Titles: {
    title: {
      Row: {
        id: number;
        title: string;
      };
      Insert: {
        title: string;
      };
      Update: {
        title: string;
      };
    };
  };
  Main: {
    main_place: {
      Row: {
        id: number;
        main_place: string;
      };
      Insert: {
        main_place: string;
      };
      Update: {
        main_place: string;
      };
    };
  };
  Sub: {
    sub_place: {
      Row: {
        id: number;
        sub_place: string;
      };
      Insert: {
        sub_place: string;
      };
      Update: {
        sub_place: string;
      };
    };
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
