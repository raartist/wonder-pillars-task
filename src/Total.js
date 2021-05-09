import React from "react";
import { Table } from "react-bootstrap";
import "./App.css";

function Total(props) {
  return (
    <div className="text-left my-3">
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        {props.data && props.data !== null && (
          <Table bordered style={{ width: "400px" }}>
            <tbody>
              <tr>
                <td>Total Basic Cost</td>
                <td>{props.data.totalBasicCost}</td>
              </tr>
              <tr>
                <td>Total Discount</td>
                <td>{props.data.totalDiscount}</td>
              </tr>
              <tr>
                <td>Total Final Basic Cost</td>
                <td>{props.data.totalFinalBasicCost}</td>
              </tr>
              <tr>
                <td>Total Tax</td>
                <td>{props.data.totalTax}</td>
              </tr>
              <tr>
                <td>Final Price</td>
                <td>{props.data.finalPrice}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default Total;
