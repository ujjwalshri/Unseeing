import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";


import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType}) => {
	
    function getPostString(){
		switch (feedType) {
			case 'all':
				return '/api/posts/all';
			case 'following':
				return '/api/posts/following';
			default:
				return '/api/posts/all';
		}
	}

	const postApiString = getPostString();

	const {data : posts , isLoading, refetch, isRefetching } = useQuery({
		queryKey : ['posts'],
		queryFn : async () => {
			try{
              const res = await fetch(postApiString);
			  const data = await res.json();
			  if(!res.ok){
				  return new Error(data.message || 'Something went wrong');
			  }
			  console.log(data);
			  return data;
			}catch(error){
				throw new Error(error);
			}
		}
	})

	useEffect(()=>{
		refetch();
	}, [feedType, refetch]);

	
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