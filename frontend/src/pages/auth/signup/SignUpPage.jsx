import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { useMutation } from "@tanstack/react-query";
import XSvg from "../../../components/svgs/X";
import { FaGraduationCap } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
    const[notification, setNotification] = useState(false);

	const [branch, setBranch] = useState("select your branch");
	useEffect(() => {	
		setTimeout(() => {		
			setNotification(true);
		}, 3000);	
		setInterval(() => {
			setNotification(false);
		}	, 10000);
	}, []);
	
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		stream : "", // Added stream to formData
		branch: "", // Added branch to formData
	});

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, password, branch, stream }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password, branch, stream }),
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
		},
		onSuccess: (data) => {
			console.log(data);
			toast.success("Signup successful");
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleBranchChange = (branch) => {
		setFormData({ ...formData, branch });
		setBranch(branch);
	};



	return (
        
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div>
  {notification && (
    <div>
<div className="toast bg">
  <div className="alert alert-info bg-gray-700">
    <span className="font-xl text-white font-mono font-extrabold"> Attention!! we do not save/share your details to anyone</span>
  </div>

</div>
    </div>
  )}
</div>
			<div></div>
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<h1 className="text-5xl font-bold">Welcome to Unseeing!</h1>
				<div>
					<img src="../public/Unseeing logo.png" alt="" />
					<div className="flex justify-center items-center mt-2">
						<h1>What is unseeing ??? </h1>
						<Link to='/about' className="btn font-mono font-extrabold">About us</Link>
					</div>
				</div>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<img src="../public/Unseeing logo.png" alt="" />
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					
						<div className="dropdown flex-1 flex flex-col justify-center items-center ">
							<div tabIndex={0} role="button" name="branch" className="btn m-1 lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col">{branch}</div>
							<ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
								<li><button type="button" onClick={() => handleBranchChange("B.tech") }>B.tech</button></li>
								<li><button type="button" onClick={() => handleBranchChange("IT")}>IT</button></li>
								<li><button type="button" onClick={() => handleBranchChange("BBA")}>BBA</button></li>
								<li><button type="button" onClick={() => handleBranchChange("LLB")}>LLB</button></li>
								<li><button type="button" onClick={() => handleBranchChange("BCA")}>BCA</button></li>
								<li><button type="button" onClick={() => handleBranchChange("BA")}>BA</button></li>
								<li><button type="button" onClick={() => handleBranchChange("MA")}>MA</button></li>
								<li><button type="button" onClick={() => handleBranchChange("MBA")}>MBA</button></li>
								<li><button type="button" onClick={() => handleBranchChange("BCOM")}>BCOM</button></li>
								<li><button type="button" onClick={() => handleBranchChange("MCOM")}>MCOM</button></li>
							</ul>
						</div>
						<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='text'
							className='grow'
							placeholder='Stream / type NA if not applicable'
							name='stream'
							onChange={handleInputChange}
							value={formData.stream}
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
					<button className='btn rounded-full btn-primary text-white'>{isPending?  "Loading...." : "signup" } </button>
					{isError && <p className='text-red-500'>Something went wrong</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;