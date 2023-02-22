import { Id, Rank, Stage } from '../types';

export const sliceByNumber = <T>(array: T[], number: number): T[][] => {
    const length = Math.ceil(array.length / number);
    const newArr: T[][] = [];
    for (let i = 0; i < length; i++) {
        newArr.push(array.slice(number * i, number * (i + 1)));
    }
    return newArr;
};

export const pronounce = async (word: string, volume: number) => {
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.volume = volume;
    utterance.onerror = (e) => {
        console.table(e);
    };
    const voices = synthesis.getVoices();
    if (voices.length === 0) {
        await new Promise<void>((resolve) => {
            synthesis.onvoiceschanged = () => {
                const voice = synthesis.getVoices().find((voice) => voice.voiceURI === 'Google US English');
                if (voice !== undefined) {
                    utterance.voice = voice;
                } else {
                    const voice = synthesis.getVoices().find((voice) => voice.lang === 'en-US');
                    if (voice !== undefined) {
                        utterance.voice = voice;
                    }
                }
                synthesis.speak(utterance);
                resolve();
            };
        });
        return;
    }
    const voice = synthesis.getVoices().find((voice) => voice.voiceURI === 'Google US English');
    if (voice !== undefined) {
        utterance.voice = voice;
    } else {
        const voice = synthesis.getVoices().find((voice) => voice.lang === 'en-US');
        if (voice !== undefined) {
            utterance.voice = voice;
        }
    }
    synthesis.speak(utterance);
};

export const sound = (type: OscillatorType, sec: number, volume: number) => {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    osc.type = type;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(sec);
};

export const typeSound = async (volume: number): Promise<void> => {
    const audio = new Audio('/typing.mp3');
    audio.volume = volume;
    audio.play();
};

export const shuffle = <T>([...arr]: T[]): T[] => {
    for (let i = arr.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

type RankIndicesObj = { rank: Rank; indices: number[] };
export const wordsCounts = [956, 882, 1024, 938];
const createIntervalArr = (start: number, end: number) => {
    if (start > end) throw Error;
    return [...Array(end - start + 1)].map((_, i) => i + start);
};
export const rankIndicesObj: RankIndicesObj[] = [
    {
        rank: '1',
        indices: createIntervalArr(1, 956),
    },
    {
        rank: '2',
        indices: createIntervalArr(957, 1838),
    },
    {
        rank: '3',
        indices: createIntervalArr(1839, 2862),
    },
    {
        rank: '4',
        indices: createIntervalArr(2863, 3800),
    },
];

type StageLoadMap = { stageNo: number; stage: { rank: Rank; id: Id; stage: Stage } }[];
export const stageLoadMap: StageLoadMap = wordsCounts
    .map((count, rankNum) => {
        const indices = new Array(count).map((_, i) => i);
        const allIndices = sliceByNumber(indices, 100);
        return allIndices
            .map((indices) => sliceByNumber(indices, 10))
            .map((v, idNum) => {
                const rank = String(rankNum + 1) as Rank;
                const id = String(idNum) as Id;
                const stage = v.map((_, stageNum) => String(stageNum) as Stage);
                return stage.map((stage) => {
                    return { stage, rank, id };
                });
            })
            .map((v) => [...v, { ...v[0], stage: 'all' as Stage }]);
    })
    .flat()
    .flat()
    .map((v, i) => {
        return { stage: v, stageNo: i };
    });

export const allRanks: Rank[] = ['1', '2', '3', '4'];
