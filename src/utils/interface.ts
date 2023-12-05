interface MainType {
  main_id: string;
  main_place: string;
}

interface SubType {
  sub_id: string;
  sub_place: string;
}

interface Anime {
  title_id: string;
  title: string;
  kanayomi: string;
  main: MainType[];
  main_id: string;
  main_place: string;
  mainPlaces: string;
  sub: SubType[];
  sub_id: string;
  sub_place: string;
  selectedSubPlaces: string;
}

type LoginInputs = {
  email: string;
  password: string;
  displayName: string;
};
