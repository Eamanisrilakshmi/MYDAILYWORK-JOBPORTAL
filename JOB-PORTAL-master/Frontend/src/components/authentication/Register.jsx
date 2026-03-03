import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const Register = () => {

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    pancard: "",
    adharcard: "",
    file: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, user } = useSelector((store) => store.auth);

  // input change
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // file upload
  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  // register submit
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("pancard", input.pancard);
    formData.append("adharcard", input.adharcard);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_ENDPOINT}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Registered Successfully");

        // redirect login page
        navigate("/login");
      }

    } catch (error) {
      console.log(error);

      const errorMessage = error.response
        ? error.response.data.message
        : "Registration failed.";

      toast.error(errorMessage);

    } finally {
      dispatch(setLoading(false));
    }
  };

  // already login redirect
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center max-w-7xl mx-auto">

        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-500 rounded-md p-4 my-10"
        >

          <h1 className="font-bold text-xl mb-5 text-center text-blue-600">
            Register
          </h1>

          <div className="my-2">
            <Label>Fullname</Label>
            <Input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="John Doe"
            />
          </div>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="johndoe@gmail.com"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="********"
            />
          </div>

          <div>
            <Label>PAN Card Number</Label>
            <Input
              type="text"
              name="pancard"
              value={input.pancard}
              onChange={changeEventHandler}
              placeholder="ABCDEF1234G"
            />
          </div>

          <div>
            <Label>Adhar Card Number</Label>
            <Input
              type="text"
              name="adharcard"
              value={input.adharcard}
              onChange={changeEventHandler}
              placeholder="123456789012"
            />
          </div>

          <div className="my-2">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="+1234567890"
            />
          </div>

          {/* Role */}
          <div className="flex items-center justify-between">

            <RadioGroup className="flex items-center gap-4 my-5">

              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={input.role === "Student"}
                  onChange={changeEventHandler}
                />
                <Label>Student</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Recruiter"
                  checked={input.role === "Recruiter"}
                  onChange={changeEventHandler}
                />
                <Label>Recruiter</Label>
              </div>

            </RadioGroup>
          </div>

          {/* Profile Image */}
          <div className="flex items-center gap-2">

            <Label>Profile Photo</Label>

            <Input
              type="file"
              accept="image/*"
              onChange={ChangeFilehandler}
            />

          </div>

          {/* Button Fixed */}
          <button
            type="submit"
            disabled={loading}
            className="block w-full py-3 my-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {loading ? "Please wait..." : "Register"}
          </button>

          <p className="text-gray-500 text-md my-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-semibold">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;