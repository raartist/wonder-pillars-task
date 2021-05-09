import { Button, Table } from "react-bootstrap";
import React from "react";
import Total from "./Total";

function Invoice() {
  const [addNew, setAddNew] = React.useState(false);
  const [total, setTotal] = React.useState(null);
  const [itemList, setItemList] = React.useState([
    {
      name: "text box1",
      rate: 10,
      qty: 10,
      basicCost: null,
      discount: 2,
      discountAmt: null,
      finalBasicCost: null,
      taxes: 10,
      taxAmt: null,
      totalCost: null,
    },
  ]);

  const calculateBasicCost = (name, index, rate, qty) => {
    const list = [...itemList];
    list[index][name] = rate * qty;
    setItemList(list);
    return rate * qty;
  };

  const calculateDiscountAmt = (name, index, basicCost, discount) => {
    let discountAmt = (basicCost * discount) / 100;
    const list = [...itemList];
    list[index][name] = discountAmt;
    return discountAmt;
  };

  const calculateFinalBasicCost = (name, index, basicCost, discountAmt) => {
    let finalBasicCost = basicCost - discountAmt;
    const list = [...itemList];
    list[index][name] = finalBasicCost;
    setItemList(list);
    return finalBasicCost;
  };

  const calculateTaxAmt = (name, index, finalBasicCost, taxes) => {
    let taxAmt = (finalBasicCost * taxes) / 100;
    const list = [...itemList];
    list[index][name] = taxAmt;
    setItemList(list);
    return taxAmt;
  };

  const calculateTotalCost = (name, index, finalBasicCost, taxAmt) => {
    let totalCost = finalBasicCost + taxAmt;
    const list = [...itemList];
    list[index][name] = totalCost;
    setItemList(list);
    return totalCost;
  };

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...itemList];
    list[index][name] = value;

    setItemList(list);
    if (name === "rate" || name === "qty") {
      calculateBasicCost(
        "basicCost",
        index,
        list[index]["rate"],
        list[index]["qty"]
      );
    }

    if (name === "rate" || name === "qty" || name === "discount") {
      calculateDiscountAmt(
        "discountAmt",
        index,
        list[index]["basicCost"],
        list[index]["discount"]
      );
      calculateFinalBasicCost(
        "finalBasicCost",
        index,
        list[index]["basicCost"],
        list[index]["discountAmt"]
      );
    }
    if (
      name === "rate" ||
      name === "qty" ||
      name === "discount" ||
      name === "taxes"
    ) {
      calculateTaxAmt(
        "taxAmt",
        index,
        list[index]["finalBasicCost"],
        list[index]["taxes"]
      );

      calculateTotalCost(
        "totalCost",
        index,
        list[index]["finalBasicCost"],
        list[index]["taxAmt"]
      );
    }
  };

  const finalData = (listupdated) => {
    const list = listupdated ? [...listupdated] : [...itemList];
    let finalPrice = 0;
    let totalBasicCost = 0;
    let totalFinalBasicCost = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    list.forEach((item, index) => {
      finalPrice += item.totalCost;
      totalBasicCost += item.basicCost;
      totalFinalBasicCost += item.finalBasicCost;
      totalDiscount += item.discount;
      totalTax += item.taxAmt;
    });
    return {
      finalPrice: finalPrice,
      totalBasicCost: totalBasicCost,
      totalFinalBasicCost: totalFinalBasicCost,
      totalDiscount: totalDiscount,
      totalTax: totalTax,
    };
  };

  const handleSave = (listupdated) => {
    setAddNew(false);
    setTotal(finalData(listupdated));
  };

  const handleAddNew = () => {
    setAddNew(true);
    setItemList([
      ...itemList,
      {
        name: "",
        rate: null,
        qty: null,
        basicCost: null,
        discount: null,
        discountAmt: null,
        finalBasicCost: null,
        taxes: null,
        taxAmt: null,
        totalCost: null,
      },
    ]);
  };

  const handleDelete = (index) => {
    const list = [...itemList];
    list.splice(index, 1);
    setItemList(list);
    handleSave(list);
  };

  const downloadFile = async () => {
    const fileName = "file";
    const json = JSON.stringify(itemList);
    const blob = new Blob([json], { type: "file/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-responsive">
      <div className="text-right">
        <Button variant="success" className="text-right" onClick={handleAddNew}>
          Add New Item
        </Button>
      </div>
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Rate</th>
            <th>Quantity</th>
            <th>Basic Cost</th>
            <th>Discount (%)</th>
            <th>Discount Amt</th>
            <th>Final Basic Cost</th>
            <th>Taxes (%)</th>
            <th>Tax Amt</th>
            <th>Total Cost</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody>
          <>
            {itemList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleFieldChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Rate"
                    name="rate"
                    value={item.rate}
                    onChange={(e) => handleFieldChange(e, index)}
                    style={{ width: "7rem" }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Quantity"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleFieldChange(e, index)}
                    style={{ width: "5rem" }}
                  />
                </td>
                <td>
                  <input
                    disabled
                    style={{ width: "5rem" }}
                    type="number"
                    placeholder="Basic Cost"
                    name="basicCost"
                    value={
                      item.basicCost === null
                        ? calculateBasicCost(
                            "basicCost",
                            index,
                            item.rate,
                            item.qty
                          )
                        : item.basicCost
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    style={{ width: "5rem" }}
                    placeholder="Discount"
                    name="discount"
                    value={item.discount}
                    onChange={(e) => handleFieldChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    disabled
                    type="number"
                    style={{ width: "5rem" }}
                    placeholder="Discount Amount"
                    name="discountAmt"
                    value={
                      item.discountAmt === null
                        ? calculateDiscountAmt(
                            "discountAmt",
                            index,
                            item.basicCost,
                            item.discount
                          )
                        : item.discountAmt
                    }
                  />
                </td>
                <td>
                  <input
                    disabled
                    type="number"
                    style={{ width: "7rem" }}
                    placeholder="Final Basic Cost"
                    name="finalBasicCost"
                    value={
                      item.finalBasicCost === null
                        ? calculateFinalBasicCost(
                            "finalBasicCost",
                            index,
                            item.basicCost,
                            item.discountAmt
                          )
                        : item.finalBasicCost
                    }
                  />
                </td>
                <td>
                  <input
                    style={{ width: "4rem" }}
                    type="number"
                    placeholder="Taxes"
                    name="taxes"
                    value={item.taxes}
                    onChange={(e) => handleFieldChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    style={{ width: "4rem" }}
                    disabled
                    type="number"
                    placeholder="Tax Amount"
                    name="taxAmt"
                    value={
                      item.taxAmt === null
                        ? calculateTaxAmt(
                            "taxAmt",
                            index,
                            item.finalBasicCost,
                            item.taxes
                          )
                        : item.taxAmt
                    }
                  />
                </td>
                <td>
                  <input
                    disabled
                    style={{ width: "7rem" }}
                    type="number"
                    placeholder="Total Cost"
                    name="totalCost"
                    value={
                      item.totalCost === null
                        ? calculateTotalCost(
                            "totalCost",
                            index,
                            item.finalBasicCost,
                            item.taxAmt
                          )
                        : item.totalCost
                    }
                  />
                </td>
                {addNew ? (
                  <Button variant="success" onClick={() => handleSave()}>
                    Save
                  </Button>
                ) : (
                  <Button variant="danger" onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                )}
              </tr>
            ))}
          </>
        </tbody>
      </Table>
      <Total data={total} />
      <Button onClick={downloadFile}>Save to json</Button>
    </div>
  );
}

export default Invoice;
