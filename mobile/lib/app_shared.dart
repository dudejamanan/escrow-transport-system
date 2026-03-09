import 'package:flutter/material.dart';

enum UserRole { customer, driver }

// Colors specific to statuses (badges/icons only)
class NestStatusColors {
  static const success = Color(0xFF4F8F73); // Payment released
  static const warning = Color(0xFFB0895A); // Escrow locked
  static const error = Color(0xFFB35C5C); // Dispute
  static const mutedText = Color(0xFF6B7280);
}

