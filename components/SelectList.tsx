import React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { Divider } from '@mui/material';
import { sliceByNumber } from '../pages/practice/[rank]/[id]';

type Props = {
    rank: number;
    wordsNum: number;
};

const SelectList: React.FC<Props> = ({ rank, wordsNum }) => {
    const stages = sliceByNumber(
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
                {stages.map((stage, i) => {
                    return (
                        <Link href={`practice/${rank}/${i}`} key={i}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <span className="text-3xl font-bold">{i + 1}</span>
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${stage[0]}~${stage.slice(-1)[0]}`}
                                    primaryTypographyProps={{ fontSize: '1.3rem', fontWeight: 500, margin: '3px' }}
                                />
                            </ListItemButton>
                            <Divider />
                        </Link>
                    );
                })}
            </List>
        </div>
    );
};

export default SelectList;
