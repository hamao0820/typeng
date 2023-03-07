import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Link from 'next/link';
import path from 'path';
import React, { useState } from 'react';

import { useAuthContext } from '../../Contexts/AuthProvider';
import useHasFavorites from '../../hooks/useHasFavorites';
import { ListOpenState, Mode, Rank, Stage, World } from '../../types';
import { rankIndicesObj, sliceByNumber } from '../../utils';
import FavoriteWordsList from '../WordsList/FavoriteWordsList';
import RankWordsList from '../WordsList/RankWordsList';
import StageWordsList from '../WordsList/StageWordsList';
import WorldWordsList from '../WordsList/WorldWordsList';

type Props = {
    rank: Rank;
    mode: Mode;
    openStates: ListOpenState[];
    handleClick: (world: World) => void;
};

const SelectList: React.FC<Props> = ({ rank, mode, openStates, handleClick }) => {
    const [isRankWordsListModalOpen, setIsRankWordsListModalOpen] = useState<boolean>(false);
    const [isWorldWordsListModalOpen, setIsWorldWordsListModalOpen] = useState<boolean>(false);
    const [isStageWordsListModalOpen, setIsStageWordsListModalOpen] = useState<boolean>(false);
    const [isFavoritesWordsListModalOpen, setIsFavoritesWordsListModalOpen] = useState<boolean>(false);
    const [activeWorld, setActiveWorld] = useState<World>('0');
    const [activeWorldAndStage, setActiveWorldAndStage] = useState<{ world: World; stage: Stage }>({
        world: '0',
        stage: 'all',
    });
    const { user } = useAuthContext();
    const hasFavorite = useHasFavorites(rank);

    const wordIndicesArr = sliceByNumber(
        rankIndicesObj.find((v) => {
            return v.rank === rank;
        })!.indices,
        100
    );

    return (
        <div className="m-2 h-full w-full">
            <RankWordsList
                rank={rank}
                isOpen={isRankWordsListModalOpen}
                close={() => {
                    setIsRankWordsListModalOpen(false);
                }}
            />
            <WorldWordsList
                rank={rank}
                world={activeWorld}
                isOpen={isWorldWordsListModalOpen}
                close={() => {
                    setIsWorldWordsListModalOpen(false);
                }}
            />
            <StageWordsList
                rank={rank}
                world={activeWorldAndStage.world}
                stage={activeWorldAndStage.stage}
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
                    height: '100%',
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                    '::-webkit-scrollbar': { display: 'none' },
                }}
                component="nav"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        <div className="flex items-center justify-between">
                            <span className="flex-1 text-2xl font-bold">Rank {rank}</span>
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
                {wordIndicesArr.map((wordIndices, world) => {
                    const openState = openStates.find((state) => state.world === String(world));
                    if (openState === undefined) return;
                    return (
                        <React.Fragment key={world}>
                            <ListItemButton
                                onClick={() => {
                                    handleClick(String(world) as World);
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
                                    setActiveWorld(String(world) as World);
                                    setIsWorldWordsListModalOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <span className="text-3xl font-bold">{world + 1}</span>
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
                                            pathname: path.join(mode, String(rank), String(world), 'all'),
                                        }}
                                    >
                                        <ListItemButton
                                            sx={{ pl: 4 }}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                setActiveWorldAndStage({
                                                    world: String(world) as World,
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
                                            <React.Fragment key={`${world}-${i}`}>
                                                <Link
                                                    href={{
                                                        pathname: path.join(
                                                            mode,
                                                            String(rank),
                                                            String(world),
                                                            String(i)
                                                        ),
                                                    }}
                                                >
                                                    <ListItemButton
                                                        sx={{ pl: 4 }}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            setActiveWorldAndStage({
                                                                world: String(world) as World,
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
