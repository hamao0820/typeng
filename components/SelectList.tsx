import React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { Collapse, Divider } from '@mui/material';
import { sliceByNumber } from '../pages/practice/[rank]/[id]';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

type Props = {
    rank: number;
    wordsNum: number;
};

type OpenStatesType = {
    block: number;
    open: boolean;
};

const SelectList: React.FC<Props> = ({ rank, wordsNum }) => {
    const [openStates, setOpenStates] = React.useState<OpenStatesType[]>(
        sliceByNumber(
            [...Array(wordsNum)].map((_, i) => i + 1),
            100
        ).map<OpenStatesType>((_, block) => {
            return { block, open: false };
        })
    );
    const handleClick = (block: number) => {
        setOpenStates((prev) =>
            prev.map((state, i) => {
                if (i !== block) {
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

    return (
        <div className="m-2 w-screen">
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
                        <span className="text-2xl font-bold">Rank {rank}</span>
                    </ListSubheader>
                }
            >
                <Divider />
                {wordIndicesArr.map((wordIndices, block) => {
                    return (
                        <React.Fragment key={block}>
                            <ListItemButton
                                onClick={() => {
                                    handleClick(block);
                                }}
                                sx={
                                    openStates[block].open
                                        ? {
                                              bgcolor: 'rgba(0, 0, 0, 0.2)',
                                          }
                                        : {}
                                }
                            >
                                <ListItemIcon>
                                    <span className="text-3xl font-bold">{block + 1}</span>
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${wordIndices[0]}~${wordIndices.slice(-1)[0]}`}
                                    primaryTypographyProps={{ fontSize: '1.3rem', fontWeight: 500, margin: '3px' }}
                                />
                                {openStates[block].open ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openStates[block].open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link href={`practice/${rank}/${block}`}>
                                        <ListItemButton sx={{ pl: 4 }}>
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
                                            <React.Fragment key={`${block}-${i}`}>
                                                <Link href={`practice/${rank}/${i}`}>
                                                    <ListItemButton sx={{ pl: 4 }}>
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
