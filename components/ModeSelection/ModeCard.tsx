import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type Props = {
    title: string;
    explanation: ReactNode;
    href: string;
};

const ModeCard: React.FC<Props> = ({ title, explanation, href }) => {
    return (
        <Link href={href}>
            <Card
                sx={{
                    width: 320,
                    height: 160,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'rgb(96 165 250)',
                    margin: '12px',
                }}
                raised={true}
            >
                <CardActionArea>
                    <CardContent
                        sx={{
                            width: 320,
                            height: 160,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography
                            gutterBottom
                            component="div"
                            sx={{ fontSize: 30, lineHeight: '36px', fontWeight: 700 }}
                            align="center"
                        >
                            {title}
                        </Typography>
                        <Typography
                            align="center"
                            sx={{
                                fontSize: '16px',
                                lineHeight: '24px',
                                fontWeight: 700,
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {explanation}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
};

export default ModeCard;
