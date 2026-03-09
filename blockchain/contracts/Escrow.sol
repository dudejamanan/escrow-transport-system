// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {

    enum OrderStatus { Created, Delivered, Completed, Disputed, Refunded }

    struct Order {
        address customer;
        address driver;
        uint amount;
        string proofHash;
        OrderStatus status;
    }

    uint public orderCount;

    mapping(uint => Order) public orders;

    event OrderCreated(uint orderId, address customer, address driver, uint amount);
    event DeliverySubmitted(uint orderId, string proofHash);
    event DeliveryConfirmed(uint orderId);
    event PaymentReleased(uint orderId);
    event DisputeRaised(uint orderId);
    event RefundIssued(uint orderId);

    function createOrder(address _driver) public payable {

        require(msg.value > 0, "Payment required");

        orderCount++;

        orders[orderCount] = Order({
            customer: msg.sender,
            driver: _driver,
            amount: msg.value,
            proofHash: "",
            status: OrderStatus.Created
        });

        emit OrderCreated(orderCount, msg.sender, _driver, msg.value);
    }

    function submitDelivery(uint _orderId, string memory _proofHash) public {

        Order storage order = orders[_orderId];

        require(msg.sender == order.driver, "Only driver");

        order.proofHash = _proofHash;
        order.status = OrderStatus.Delivered;

        emit DeliverySubmitted(_orderId, _proofHash);
    }

    function confirmDelivery(uint _orderId) public {

        Order storage order = orders[_orderId];

        require(msg.sender == order.customer, "Only customer");

        order.status = OrderStatus.Completed;

        payable(order.driver).transfer(order.amount);

        emit DeliveryConfirmed(_orderId);
        emit PaymentReleased(_orderId);
    }

    function raiseDispute(uint _orderId) public {

        Order storage order = orders[_orderId];

        require(msg.sender == order.customer, "Only customer");

        order.status = OrderStatus.Disputed;

        emit DisputeRaised(_orderId);
    }

    function refundCustomer(uint _orderId) public {

        Order storage order = orders[_orderId];

        require(order.status == OrderStatus.Disputed, "No dispute");

        order.status = OrderStatus.Refunded;

        payable(order.customer).transfer(order.amount);

        emit RefundIssued(_orderId);
    }
}