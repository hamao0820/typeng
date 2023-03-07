import React from 'react';

import { useAuthContext } from '../../Contexts/AuthProvider';

const Information = () => {
    const { user } = useAuthContext();
    return (
        <div className="fit absolute top-16 right-2 z-10 flex w-64 flex-col items-center justify-center rounded-md border-2 border-solid border-black bg-white">
            <div className="m-2 flex-col items-center text-lg md:flex">
                <div>リストを右クリックすると単語一覧が表示されます</div>
                {user ? (
                    <div>一覧から苦手な単語を登録することができます</div>
                ) : (
                    <div>ログインすると一覧から苦手な単語を登録することができます</div>
                )}
            </div>
        </div>
    );
};

export default Information;
