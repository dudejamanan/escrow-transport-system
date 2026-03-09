import 'package:flutter/material.dart';
import 'app_shared.dart';

class Session extends ChangeNotifier {
  Session._();

  static final Session instance = Session._();

  String? token;
  int? userId;
  String? name;
  String? email;
  String? walletAddress;
  UserRole? role;

  bool get isAuthenticated => token != null && role != null;

  void updateFromLogin({
    required String jwt,
    required int id,
    required String userName,
    required String userEmail,
    required String userRole,
    String? wallet,
  }) {
    token = jwt;
    userId = id;
    name = userName;
    email = userEmail;
    walletAddress = wallet;
    role = userRole == 'driver' ? UserRole.driver : UserRole.customer;
    notifyListeners();
  }

  void clear() {
    token = null;
    userId = null;
    name = null;
    email = null;
    walletAddress = null;
    role = null;
    notifyListeners();
  }
}

