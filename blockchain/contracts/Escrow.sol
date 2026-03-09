// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {

    enum OrderStatus {
        Created,
        Delivered,
        Completed,
        Disputed,
        Refunded
    }

    struct Order {
        uint id;
        address customer;
        address driver;
        uint amount;
        string proofHash;
        OrderStatus status;
        uint createdAt;
    }

    uint public orderCount;

    mapping(uint => Order) public orders;

    event OrderCreated(uint orderId, address customer, address driver, uint amount);
    event DeliverySubmitted(uint orderId, string proofHash);
    event DeliveryConfirmed(uint orderId);
    event PaymentReleased(uint orderId);
    event DisputeRaised(uint orderId);
    event RefundIssued(uint orderId);

    // Customer creates order and locks payment
    function createOrder(address _driver) public payable {

        require(msg.value > 0, "Payment required");

        orderCount++;

        orders[orderCount] = Order({
            id: orderCount,
            customer: msg.sender,
            driver: _driver,
            amount: msg.value,
            proofHash: "",
            status: OrderStatus.Created,
            createdAt: block.timestamp
        });

        emit OrderCreated(orderCount, msg.sender, _driver, msg.value);
    }

    // Driver submits delivery proof (IPFS hash)
    function submitDelivery(uint _orderId, string memory _proofHash) public {

        Order storage order = orders[_orderId];

        require(msg.sender == order.driver, "Only driver can submit");
        require(order.status == OrderStatus.Created, "Invalid order state");

        order.proofHash = _proofHash;
        order.status = OrderStatus.Delivered;

        emit DeliverySubmitted(_orderId, _proofHash);
    }

    // Customer confirms delivery
    function confirmDelivery(uint _orderId) public {

        Order storage order = orders[_orderId];

        require(msg.sender == order.customer, "Only customer");
        require(order.status == OrderStatus.Delivered, "Delivery not submitted");

        order.status = OrderStatus.Completed;

        payable(order.driver).transfer(order.amount);

        emit DeliveryConfirmed(_orderId);
        emit PaymentReleased(_orderId);
    }

    // Customer raises dispute
    function raiseDispute(uint _orderId) public {

        Order storage order = orders[_orderId];

        require(msg.sender == order.customer, "Only customer");
        require(order.status == OrderStatus.Delivered, "Cannot dispute");

        order.status = OrderStatus.Disputed;

        emit DisputeRaised(_orderId);
    }

    // Admin/system resolves dispute with refund
    function refundCustomer(uint _orderId) public {

        Order storage order = orders[_orderId];

        require(order.status == OrderStatus.Disputed, "No dispute active");

        order.status = OrderStatus.Refunded;

        payable(order.customer).transfer(order.amount);

        emit RefundIssued(_orderId);
    }

    // Helper function to fetch order details
    function getOrder(uint _orderId) public view returns (Order memory) {
        return orders[_orderId];
    }
}