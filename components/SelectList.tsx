import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import UnfoldLess from '@mui/icons-material/UnfoldLess';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import path from 'path';
import { Id, Mode, Rank, Stage } from '../types';
import { sliceByNumber } from '../utils';
import RankWordsList from './RankWordsList';
import IdWordsList from './IdWordsList';
import StageWordsList from './StageWordsList';

type Props = {
    rank: Rank;
    wordsNum: number;
    mode: Mode;
};

type OpenStatesType = {
    id: Id;
    open: boolean;
};

const SelectList: React.FC<Props> = ({ rank, wordsNum, mode }) => {
    const [openStates, setOpenStates] = React.useState<OpenStatesType[]>(
        sliceByNumber(
            [...Array(wordsNum)].map((_, i) => i + 1),
            100
        ).map<OpenStatesType>((_, id) => {
            return { id: String(id) as Id, open: false };
        })
    );
    const [isRankWordsListModalOpen, setIsRankWordsListModalOpen] = useState<boolean>(false);
    const [isIdWordsListModalOpen, setIsIdWordsListModalOpen] = useState<boolean>(false);
    const [isStageWordsListModalOpen, setIsStageWordsListModalOpen] = useState<boolean>(false);

    const handleClick = (id: number) => {
        setOpenStates((prev) =>
            prev.map((state, i) => {
                if (i !== id) {
                    return state;
                } else {
                    return { ...state, open: !state.open };
                }
            })
        );
    };
    const wordIndicesArr = sliceByNumber(
        [...Array(wordsNum)].map((_, i) => i + 1),
        100
    );

    const handleCollapseAll = () => {
        setOpenStates((prevStates) => {
            return prevStates.map((state) => {
                return { ...state, open: false };
            });
        });
    };

    const [activeId, setActiveId] = useState<Id | ''>('');
    useEffect(() => {
        if (activeId === '') return;
        setIsIdWordsListModalOpen(true);
    }, [activeId]);

    const [activeIdAndStage, setActiveIdAndStage] = useState<{ id: Id | ''; stage: Stage | '' }>({ id: '', stage: '' });
    useEffect(() => {
        if (activeIdAndStage.id === '' || activeIdAndStage.stage === '') return;
        setIsStageWordsListModalOpen(true);
    }, [activeIdAndStage]);

    return (
        <div className="m-2 w-screen">
            <RankWordsList
                rank={String(rank) as Rank}
                isOpen={isRankWordsListModalOpen}
                close={() => {
                    setIsRankWordsListModalOpen(false);
                }}
            />
            <IdWordsList
                rank={rank}
                id={activeId === '' ? '0' : activeId}
                isOpen={isIdWordsListModalOpen}
                close={() => {
                    setIsIdWordsListModalOpen(false);
                }}
            />
            <StageWordsList
                rank={rank}
                id={activeIdAndStage.id === '' ? '0' : activeIdAndStage.id}
                stage={activeIdAndStage.stage === '' ? 'all' : activeIdAndStage.stage}
                isOpen={isStageWordsListModalOpen}
                close={() => {
                    setIsStageWordsListModalOpen(false);
                }}
            />
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    height: '85vh',
                    overflow: 'auto',
                    '::-webkit-scrollbar': { display: 'none' },
                }}
                component="nav"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold flex-1">Rank {rank}</span>
                            <Button
                                sx={{
                                    border: '2px solid rgb(147, 197, 253)',
                                    minWidth: '32px',
                                    width: '32px',
                                    height: '32px',
                                    padding: 0,
                                    margin: '1px',
                                }}
                                onClick={() => setIsRankWordsListModalOpen(true)}
                            >
                                <FormatListNumberedIcon></FormatListNumberedIcon>
                            </Button>
                            <Button
                                sx={{
                                    border: '2px solid rgb(147, 197, 253)',
                                    minWidth: '32px',
                                    width: '32px',
                                    height: '32px',
                                    padding: 0,
                                    margin: '1px',
                                }}
                                onClick={handleCollapseAll}
                            >
                                <UnfoldLess />
                            </Button>
                        </div>
                    </ListSubheader>
                }
            >
                <Divider />
                {wordIndicesArr.map((wordIndices, id) => {
                    return (
                        <React.Fragment key={id}>
                            <ListItemButton
                                onClick={() => {
                                    handleClick(id);
                                }}
                                sx={
                                    openStates[id].open
                                        ? {
                                              bgcolor: 'rgba(0, 0, 0, 0.2)',
                                          }
                                        : {}
                                }
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setActiveId(String(id) as Id);
                                }}
                            >
                                <ListItemIcon>
                                    <span className="text-3xl font-bold">{id + 1}</span>
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${wordIndices[0]}~${wordIndices.slice(-1)[0]}`}
                                    primaryTypographyProps={{ fontSize: '1.3rem', fontWeight: 500, margin: '3px' }}
                                />
                                {openStates[id].open ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openStates[id].open} timeout="auto" unmountOnExit>
                                <List
                                    component="div"
                                    disablePadding
                                    sx={{
                                        height: '60vh',
                                        overflow: 'auto',
                                        '::-webkit-scrollbar': { display: 'none' },
                                    }}
                                >
                                    <Link
                                        href={{
                                            pathname: path.join(mode, String(rank), String(id)),
                                            query: { stage: 'all' },
                                        }}
                                    >
                                        <ListItemButton
                                            sx={{ pl: 4 }}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                setActiveIdAndStage({
                                                    id: String(id) as Id,
                                                    stage: 'all',
                                                });
                                            }}
                                        >
                                            <ListItemIcon>
                                                <span className="text-xl font-bold">{1}</span>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${wordIndices[0]}~${wordIndices.slice(-1)[0]}`}
                                                primaryTypographyProps={{
                                                    fontSize: '1.2rem',
                                                    fontWeight: 400,
                                                    margin: '3px',
                                                }}
                                            />
                                        </ListItemButton>
                                        <Divider />
                                    </Link>
                                    {sliceByNumber(wordIndices, 10).map((wordIndices, i) => {
                                        return (
                                            <React.Fragment key={`${id}-${i}`}>
                                                <Link
                                                    href={{
                                                        pathname: path.join(mode, String(rank), String(id)),
                                                        query: { stage: String(i) },
                                                    }}
                                                >
                                                    <ListItemButton
                                                        sx={{ pl: 4 }}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            setActiveIdAndStage({
                                                                id: String(id) as Id,
                                                                stage: String(i) as Stage,
                                                            });
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <span className="text-xl font-bold">{i + 2}</span>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={`${wordIndices[0]}~${wordIndices.slice(-1)[0]}`}
                                                            primaryTypographyProps={{
                                                                fontSize: '1.2rem',
                                                                fontWeight: 400,
                                                                margin: '3px',
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                    <Divider />
                                                </Link>
                                            </React.Fragment>
                                        );
                                    })}
                                </List>
                            </Collapse>
                            <Divider />
                        </React.Fragment>
                    );
                })}
            </List>
        </div>
    );
};

export default SelectList;
