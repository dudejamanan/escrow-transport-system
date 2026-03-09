import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import 'app_shared.dart';
import 'session.dart';

class ApiClient {
  ApiClient._();

  static final ApiClient instance = ApiClient._();

  // Adjust base URL depending on platform.
  // - Web: `localhost` works directly.
  // - Android emulator: host machine is `10.0.2.2`.
  static String get _baseUrl =>
      kIsWeb ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

  Uri _uri(String path) => Uri.parse('$_baseUrl$path');

  Map<String, String> _headers({bool withAuth = false}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    if (withAuth && Session.instance.token != null) {
      headers['Authorization'] = 'Bearer ${Session.instance.token}';
    }
    return headers;
  }

  // ---------- Auth ----------

  Future<void> login(String email, String password) async {
    final res = await http.post(
      _uri('/api/users/login'),
      headers: _headers(),
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (res.statusCode != 200) {
      throw Exception(jsonDecode(res.body)['error'] ?? 'Login failed');
    }

    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;

    Session.instance.updateFromLogin(
      jwt: data['token'] as String,
      id: user['id'] as int,
      userName: user['name'] as String,
      userEmail: user['email'] as String,
      userRole: user['role'] as String,
      wallet: user['wallet_address'] as String?,
    );
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
    required UserRole role,
    String? walletAddress,
  }) async {
    final res = await http.post(
      _uri('/api/users/register'),
      headers: _headers(),
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'role': role == UserRole.driver ? 'driver' : 'customer',
        'walletAddress': walletAddress,
      }),
    );

    if (res.statusCode != 201) {
      throw Exception(jsonDecode(res.body)['error'] ?? 'Registration failed');
    }

    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final user = data['user'] as Map<String, dynamic>;

    Session.instance.updateFromLogin(
      jwt: data['token'] as String,
      id: user['id'] as int,
      userName: user['name'] as String,
      userEmail: user['email'] as String,
      userRole: user['role'] as String,
      wallet: user['wallet_address'] as String?,
    );
  }

  // ---------- Orders (customer & driver) ----------

  Future<List<Map<String, dynamic>>> getMyOrders() async {
    final res = await http.get(
      _uri('/api/orders/my-orders'),
      headers: _headers(withAuth: true),
    );
    if (res.statusCode != 200) {
      throw Exception(jsonDecode(res.body)['error'] ?? 'Failed to fetch orders');
    }
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return (data['orders'] as List).cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getAvailableOrdersForDriver() async {
    final res = await http.get(
      _uri('/api/orders/available'),
      headers: _headers(withAuth: true),
    );
    if (res.statusCode != 200) {
      throw Exception(
        jsonDecode(res.body)['error'] ?? 'Failed to fetch available orders',
      );
    }
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return (data['orders'] as List).cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> createOrder({
    required String pickupLocation,
    required String dropLocation,
    required double amount,
    int? driverId,
  }) async {
    final res = await http.post(
      _uri('/api/orders'),
      headers: _headers(withAuth: true),
      body: jsonEncode({
        'pickupLocation': pickupLocation,
        'dropLocation': dropLocation,
        'amount': amount,
        'driverId': driverId,
      }),
    );

    if (res.statusCode != 201) {
      throw Exception(jsonDecode(res.body)['error'] ?? 'Failed to create order');
    }

    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return data['order'] as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> acceptOrder(int orderId) async {
    final res = await http.post(
      _uri('/api/orders/$orderId/accept'),
      headers: _headers(withAuth: true),
    );
    if (res.statusCode != 200) {
      throw Exception(jsonDecode(res.body)['error'] ?? 'Failed to accept order');
    }
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return data['order'] as Map<String, dynamic>;
  }

  // ---------- Delivery ----------

  Future<void> uploadDeliveryProof({
    required int orderId,
    required String imageUrl,
  }) async {
    final res = await http.post(
      _uri('/api/delivery/proofs'),
      headers: _headers(withAuth: true),
      body: jsonEncode({'orderId': orderId, 'imageUrl': imageUrl}),
    );
    if (res.statusCode != 201) {
      throw Exception(
        jsonDecode(res.body)['error'] ?? 'Failed to upload delivery proof',
      );
    }
  }

  Future<void> createDeliveryConfirmation({
    required int orderId,
    required String confirmationCode,
  }) async {
    final res = await http.post(
      _uri('/api/delivery/confirmations'),
      headers: _headers(withAuth: true),
      body: jsonEncode({
        'orderId': orderId,
        'confirmationMethod': 'OTP',
        'confirmationCode': confirmationCode,
      }),
    );
    if (res.statusCode != 201) {
      throw Exception(
        jsonDecode(res.body)['error'] ?? 'Failed to create delivery confirmation',
      );
    }
  }

  Future<void> verifyDeliveryConfirmation({
    required int orderId,
    required String confirmationCode,
  }) async {
    final res = await http.post(
      _uri('/api/delivery/confirmations/verify'),
      headers: _headers(withAuth: true),
      body: jsonEncode({
        'orderId': orderId,
        'confirmationCode': confirmationCode,
      }),
    );
    if (res.statusCode != 200) {
      throw Exception(
        jsonDecode(res.body)['error'] ?? 'Failed to verify delivery confirmation',
      );
    }
  }

  // ---------- Escrow ----------

  Future<List<Map<String, dynamic>>> getEscrows() async {
    final res = await http.get(
      _uri('/api/escrow/escrows'),
      headers: _headers(),
    );
    if (res.statusCode != 200) {
      throw Exception(
        jsonDecode(res.body)['error'] ?? 'Failed to fetch escrows',
      );
    }
    return (jsonDecode(res.body) as List).cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> createEscrow({
    required String buyerWallet,
    required String sellerWallet,
    required double amount,
  }) async {
    final res = await http.post(
      _uri('/api/escrow/createEscrow'),
      headers: _headers(),
      body: jsonEncode({
        'buyer_wallet': buyerWallet,
        'seller_wallet': sellerWallet,
        'amount': amount,
      }),
    );

    if (res.statusCode != 200) {
      throw Exception(
        jsonDecode(res.body)['error'] ?? 'Failed to create escrow',
      );
    }

    return jsonDecode(res.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> confirmEscrowDelivery(int escrowId) async {
    final res = await http.post(
      _uri('/api/escrow/confirmDelivery/$escrowId'),
      headers: _headers(),
    );
    if (res.statusCode != 200) {
      throw Exception(
        jsonDecode(res.body)['error'] ?? 'Failed to confirm escrow delivery',
      );
    }
    return jsonDecode(res.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> refundEscrow(int escrowId) async {
    final res = await http.post(
      _uri('/api/escrow/refund/$escrowId'),
      headers: _headers(),
    );
    if (res.statusCode != 200) {
      throw Exception(
        jsonDecode(res.body)['error'] ?? 'Failed to refund escrow',
      );
    }
    return jsonDecode(res.body) as Map<String, dynamic>;
  }
}

