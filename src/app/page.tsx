"use client";

import React, { useEffect, useRef, useState } from "react";
const page = () => {
  const BASE_URL = "http://localhost:3300";

  const [coupons, setCoupons] = useState([]);

  const nameRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const daysRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);

  const getAllCoupons = async () => {
    try {
      const response = await fetch(`${BASE_URL}/coupon/coupons`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.status) {
        setCoupons(data.data);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      alert("Error occured while fetching data");
    }
  };

  const deleteAllCoupons = async () => {
    try {
      const response = await fetch(`${BASE_URL}/coupon/coupons`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status) {
        alert("All coupons deleted successfully");
      } else {
        alert("Error occured while deleting coupons");
      }
      await getAllCoupons();
    } catch (error) {
      alert("Error occured while fetching data");
    }
  };

  const addCoupons = async () => {
    if (
      nameRef.current?.value === "" ||
      nameRef.current?.value == undefined ||
      nameRef.current?.value == null
    ) {
      alert("Name is required");
      return;
    }

    if (
      codeRef.current?.value === "" ||
      codeRef.current?.value == undefined ||
      codeRef.current?.value == null
    ) {
      alert("Code is required");
      return;
    }

    if (
      daysRef.current?.value === "" ||
      daysRef.current?.value == undefined ||
      daysRef.current?.value == null
    ) {
      alert("Day is required");
      return;
    }

    if (
      discountRef.current?.value === "" ||
      discountRef.current?.value == undefined ||
      discountRef.current?.value == null
    ) {
      alert("Discount is required");
      return;
    }

    const data = {
      name: nameRef.current?.value,
      code: codeRef.current?.value,
      days: daysRef.current?.value,
      discount: discountRef.current?.value,
    };

    try {
      const response = await fetch(`${BASE_URL}/coupon/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        alert("Coupon added successfully");
        await getAllCoupons();
        nameRef.current!.value = "";
        codeRef.current!.value = "";
        daysRef.current!.value = "";
        discountRef.current!.value = "";
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      alert("Error occured while adding coupon");
    }
  };

  const deleteCoupon = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/coupon/coupon/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status) {
        alert("Coupon deleted successfully");
      } else {
        alert("Error occured while deleting coupon");
      }
      await getAllCoupons();
    } catch (error) {
      alert("Error occured while fetching data");
    }
  };

  useEffect(() => {
    getAllCoupons();
  }, []);

  return (
    <>
      <h1 className="title">Coupon System App</h1>

      <div className="form_box">
        <h2 className="from_title">Add Coupon</h2>
        <div>
          <label>Name</label>
          <br />
          <input ref={nameRef} type="text" placeholder="enter name" /> <br />
          <label>Code</label>
          <br />
          <input ref={codeRef} type="text" placeholder="enter code" /> <br />
          <label>Day</label>
          <br />
          <input ref={daysRef} type="number" placeholder="enter days" />
          <br />
          <label>Discount</label>
          <br />
          <input ref={discountRef} type="number" placeholder="enter discount" />
          <br />
          <button onClick={addCoupons} className="submit_button">
            Submit
          </button>
        </div>
      </div>
      <div className="couponBox">
        <nav>
          <div>
            <h1>Coupon System</h1>
          </div>
          <div>
            {/* <button className="addCouponBtn">Add</button>{" "} */}
            <button className="deleteCouponBtn" onClick={deleteAllCoupons}>
              Delete All
            </button>
          </div>
        </nav>
      </div>

      {coupons.length === 0 ? (
        <>
          <h1>There is no coupons right now</h1>
        </>
      ) : (
        <div className="dataDisplayContainer">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Code</th>
                <th>Day</th>
                <th>Expired At</th>
                <th>Actions</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon: any, index: number) => (
                <Coupons key={coupon.id} {...coupon} deletefun={deleteCoupon} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="bottom_spacer"></div>
    </>
  );
};

export default page;

type CouponType = {
  id: number;
  name: string;
  code: string;
  days: number;
  createdAt: string;
  deletefun: (id: number) => void;
};

const Coupons = (props: CouponType) => {
  const isExpired = (): string => {
    const createdAt = new Date(props.createdAt!);
    const days = props.days;

    const expiredAt = new Date(createdAt.setDate(createdAt.getDate() + days));

    if (new Date() > expiredAt) {
      return "Expired";
    }
    return "Active";
  };
  return (
    <tr>
      <td>{props.id}</td>
      <td>{props.name}</td>
      <td>{props.code}</td>
      <td>{props.days}</td>
      <td>{isExpired()}</td>

      <td>
        <button
          onClick={() => props.deletefun(props.id)}
          className="deleteCouponBtn"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
