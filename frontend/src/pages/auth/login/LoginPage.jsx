import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {

	const queryClient = useQueryClient();

		const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
   const {mutate, isError, isPending, error} = useMutation({
	mutationFn : async ({email, password}) => {
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			if (res.ok) {
				const data = await res.json();
				if (data.error) {
					console.error(data.error);
					throw new Error(data.error);
				}
				console.log(data);
				return data;
			} else {
				const errorData = await res.json();
				throw new Error(errorData.error || "Unknown error occurred");
			}
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
			// Optionally, rethrow the error if you want to handle it elsewhere
			throw error;
		}
		
	}	,
	onSuccess : () => {
		toast.success("Login successful");
		queryClient.invalidateQueries({ queryKey : ['Auth user']});
	}
   })
   

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	
	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center p-8'>
			<img src="../public/Unseeing logo.png" alt="" />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
				<img src="../public/Unseeing logo.png" alt="" />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>Login</button>
					{isError && <p className='text-red-500'>
						{error.message}
						</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;