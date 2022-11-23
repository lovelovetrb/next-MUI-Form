import React, { useState } from "react";
// MUI
import { Button, TextField, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";

// react-hook-form
import { useForm, Controller } from "react-hook-form";

// yup : Validation package
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Router, useRouter } from "next/router";

type formValues = {
  email: string;
  password: string;
};

export default function Home() {
  const router = useRouter();
  const bcrypt = require("bcryptjs");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<formValues>({
    email: "",
    password: "",
  });

  const schema = yup.object({
    email: yup.string().required("email is required").email("invaild email"),
    password: yup
      .string()
      .required("password is requred")
      .min(6, "password is over 6 words")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&].*$/,
        "Password must contain alphanumeric characters"
      ),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: formValues) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const userData: formValues = {
      email: data.email,
      password: hashedPassword,
    };

    setFormData(userData);

    reset();
    router.push({
      pathname: "result",
      query: userData,
    });
  };

  return (
    <Stack
      component="form"
      noValidate
      spacing={3}
      sx={{ m: 2 }}
      direction="column"
      alignItems="center"
    >
      <h1>Regist Form</h1>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type="text"
            label="email"
            required
            error={"email" in errors}
            helperText={errors.email?.message}
            color="secondary"
            sx={{ m: 1, width: "50ch" }}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type={showPassword ? "text" : "password"}
            label="password"
            required
            error={"password" in errors}
            helperText={errors.password?.message}
            color="secondary"
            sx={{ m: 1, width: "50ch" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <Button
        onClick={handleSubmit(onSubmit)}
        variant="contained"
        size="large"
        sx={{ m: 1, width: "30ch" }}
      >
        submit
      </Button>
    </Stack>
  );
}
