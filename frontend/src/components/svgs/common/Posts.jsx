import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, userId }) => {

    function getPostString() {
        switch (feedType) {
            case 'all':
                return '/api/posts/all';
            case 'following':
                return '/api/posts/following';
            case 'likes':
                return `/api/posts/liked/${userId}`;
            case 'posts':
                return `/api/posts/user/${userId}`;
            default:
                return '/api/posts/all';
        }
    }

    const postApiString = getPostString();

    const { data: posts, isLoading, refetch, isRefetching, isError, error } = useQuery({
        queryKey: ['posts', feedType, userId],
        queryFn: async () => {
            const res = await fetch(postApiString);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Something went wrong');
            }
            return res.json();
        }
    });

    useEffect(() => {
        refetch();
    }, [feedType, userId, refetch]);

    if (isError) {
        return <p className='text-center my-4'>Error: {error.message}</p>;
    }

    return (
        <>
            {(isLoading || isRefetching) && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
            {!isLoading && !isRefetching && posts && (
                <div>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Posts;