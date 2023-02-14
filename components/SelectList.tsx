import React from 'react';
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
import { sliceByNumber } from '../pages/practice/[rank]/[id]';
import path from 'path';
import type { Mode } from '../types';

type Props = {
    rank: number;
    wordsNum: number;
    mode: Mode;
};

type OpenStatesType = {
    block: number;
    open: boolean;
};

// TODO: 単語一覧の表示
// https://mui.com/material-ui/react-dialog/#scrolling-long-content
const SelectList: React.FC<Props> = ({ rank, wordsNum, mode }) => {
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

    const handleCollapseAll = () => {
        setOpenStates((prevStates) => {
            return prevStates.map((state) => {
                return { ...state, open: false };
            });
        });
    };

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
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold">Rank {rank}</span>
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
                                            pathname: path.join(mode, String(rank), String(block)),
                                            query: { stage: 'all' },
                                        }}
                                    >
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
                                                <Link
                                                    href={{
                                                        pathname: path.join(mode, String(rank), String(block)),
                                                        query: { stage: String(i) },
                                                    }}
                                                >
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
