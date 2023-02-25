import React, { useState } from 'react';
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
import StarIcon from '@mui/icons-material/Star';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import path from 'path';
import { Id, ListOpenState, Mode, Rank, Stage } from '../../types';
import { rankIndicesObj, sliceByNumber } from '../../utils';
import RankWordsList from './RankWordsList';
import IdWordsList from './IdWordsList';
import StageWordsList from './StageWordsList';
import FavoriteWordsList from './FavoriteWordsList';
import { useAuthContext } from '../../Contexts/AuthProvider';
import useHasFavorites from '../../hooks/useHasFavorites';

type Props = {
    rank: Rank;
    mode: Mode;
    openStates: ListOpenState[];
    handleClick: (id: Id) => void;
};

const SelectList: React.FC<Props> = ({ rank, mode, openStates, handleClick }) => {
    const [isRankWordsListModalOpen, setIsRankWordsListModalOpen] = useState<boolean>(false);
    const [isIdWordsListModalOpen, setIsIdWordsListModalOpen] = useState<boolean>(false);
    const [isStageWordsListModalOpen, setIsStageWordsListModalOpen] = useState<boolean>(false);
    const [isFavoritesWordsListModalOpen, setIsFavoritesWordsListModalOpen] = useState<boolean>(false);
    const [activeId, setActiveId] = useState<Id>('0');
    const [activeIdAndStage, setActiveIdAndStage] = useState<{ id: Id; stage: Stage }>({ id: '0', stage: 'all' });
    const { user } = useAuthContext();
    const hasFavorite = useHasFavorites(rank);

    const wordIndicesArr = sliceByNumber(
        rankIndicesObj.find((v) => {
            return v.rank === rank;
        })!.indices,
        100
    );

    return (
        <div className="m-2 w-screen">
            <RankWordsList
                rank={rank}
                isOpen={isRankWordsListModalOpen}
                close={() => {
                    setIsRankWordsListModalOpen(false);
                }}
            />
            <IdWordsList
                rank={rank}
                id={activeId}
                isOpen={isIdWordsListModalOpen}
                close={() => {
                    setIsIdWordsListModalOpen(false);
                }}
            />
            <StageWordsList
                rank={rank}
                id={activeIdAndStage.id}
                stage={activeIdAndStage.stage}
                isOpen={isStageWordsListModalOpen}
                close={() => {
                    setIsStageWordsListModalOpen(false);
                }}
            />
            {user && (
                <FavoriteWordsList
                    rank={rank}
                    isOpen={isFavoritesWordsListModalOpen}
                    close={() => setIsFavoritesWordsListModalOpen(false)}
                />
            )}
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
                        </div>
                    </ListSubheader>
                }
            >
                {user && (
                    <>
                        <Divider />
                        <Link
                            href={{
                                pathname: hasFavorite ? path.join(mode, rank, 'favorites') : mode,
                            }}
                        >
                            <ListItemButton
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setIsFavoritesWordsListModalOpen(true);
                                }}
                                disabled={!hasFavorite}
                            >
                                <ListItemIcon>
                                    <StarIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`苦手な単語`}
                                    primaryTypographyProps={{ fontSize: '1.3rem', fontWeight: 500, margin: '3px' }}
                                />
                            </ListItemButton>
                        </Link>
                        <Divider />
                    </>
                )}
                {wordIndicesArr.map((wordIndices, id) => {
                    const openState = openStates.find((state) => state.id === String(id));
                    if (openState === undefined) return;
                    return (
                        <React.Fragment key={id}>
                            <ListItemButton
                                onClick={() => {
                                    handleClick(String(id) as Id);
                                }}
                                sx={
                                    openState.open
                                        ? {
                                              bgcolor: 'rgba(0, 0, 0, 0.2)',
                                          }
                                        : {}
                                }
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setActiveId(String(id) as Id);
                                    setIsIdWordsListModalOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <span className="text-3xl font-bold">{id + 1}</span>
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${wordIndices[0]}~${wordIndices.slice(-1)[0]}`}
                                    primaryTypographyProps={{ fontSize: '1.3rem', fontWeight: 500, margin: '3px' }}
                                />
                                {openState.open ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openState.open} timeout="auto" unmountOnExit>
                                <List
                                    component="div"
                                    disablePadding
                                    sx={{
                                        height: '60vh',
                                        overflow: 'auto',
                                        '::-webkit-scrollbar': { display: 'none' },
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
                                                setIsStageWordsListModalOpen(true);
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
                                                            setIsStageWordsListModalOpen(true);
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
