export type Word = {
    id: number;
    en: string;
    ja: string;
};

export type Mode = 'practice' | 'test' | 'challenge' | 'scoring';
export type Rank = '1' | '2' | '3' | '4';
export type World = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
export type Stage = 'all' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type PageProps = { allWords: Word[]; pathParam: PathParam };
export type PathParams = {
    rank: Rank;
    world: World;
};

export type ResultType = Word & {
    correct: boolean;
};

export type PathParam = {
    mode: Mode;
    rank: Rank;
    world: World;
    stage: Stage;
};

export type ListOpenState = {
    world: World;
    open: boolean;
};

export type Loading = 'hold' | 'loading' | 'done';
