import 'package:flutter/material.dart';

import 'api_client.dart';
import 'app_shared.dart';
import 'session.dart';
import 'splash_screen.dart';

void main() {
  runApp(const NestApp());
}

class NestApp extends StatelessWidget {
  const NestApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'NEST',
      theme: _buildDarkFintechTheme(),
      initialRoute: SplashScreen.routeName,
      routes: {
        SplashScreen.routeName: (_) => const SplashScreen(),
        RoleSelectionScreen.routeName: (_) => const RoleSelectionScreen(),
        LoginScreen.customerRoute: (_) =>
            const LoginScreen(role: UserRole.customer),
        LoginScreen.driverRoute: (_) =>
            const LoginScreen(role: UserRole.driver),
        SignUpScreen.customerRoute: (_) =>
            const SignUpScreen(role: UserRole.customer),
        SignUpScreen.driverRoute: (_) =>
            const SignUpScreen(role: UserRole.driver),
        CustomerHomeScreen.routeName: (_) => const CustomerHomeScreen(),
        DriverDashboardScreen.routeName: (_) => const DriverDashboardScreen(),
        TripTrackingScreen.customerRoute: (_) =>
            const TripTrackingScreen(role: UserRole.customer),
        TripTrackingScreen.driverRoute: (_) =>
            const TripTrackingScreen(role: UserRole.driver),
        EscrowStatusScreen.routeName: (_) => const EscrowStatusScreen(),
        DeliveryConfirmationScreen.routeName: (_) =>
            const DeliveryConfirmationScreen(),
        ProfileScreen.customerRoute: (_) =>
            const ProfileScreen(role: UserRole.customer),
        ProfileScreen.driverRoute: (_) =>
            const ProfileScreen(role: UserRole.driver),
      },
    );
  }
}

ThemeData _buildDarkFintechTheme() {
  const primaryBackground = Color(0xFF161616);
  const cardSurface = Color(0xFF171A21);
  const inputField = Color(0xFF1F232C);
  const accent = Color(0xFF5C6AC4);
  const primaryText = Color(0xFFE6E8EB);
  const secondaryText = Color(0xFF9AA0AA);

  final base = ThemeData.dark();

  return base.copyWith(
    scaffoldBackgroundColor: const Color(0xFF161616),
    useMaterial3: true,
    primaryColor: accent,
    colorScheme: base.colorScheme.copyWith(
      primary: accent,
      secondary: accent,
      surface: cardSurface,
      background: primaryBackground,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: const Color(0xFF161616),
      foregroundColor: primaryText,
      surfaceTintColor: Colors.transparent,
    ),
    cardColor: cardSurface,
    dividerColor: const Color(0xFF2A2F3A),
    textTheme: base.textTheme.apply(
      bodyColor: primaryText,
      displayColor: primaryText,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: inputField,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF2A2F3A)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: accent),
      ),
      hintStyle: const TextStyle(color: secondaryText),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: accent,
        foregroundColor: primaryText,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
        padding: const EdgeInsets.symmetric(vertical: 14),
        textStyle: const TextStyle(
          fontWeight: FontWeight.w600,
          letterSpacing: 0.3,
        ),
      ),
    ),
  );
}

// 2. Role Selection Screen
class RoleSelectionScreen extends StatelessWidget {
  static const routeName = '/role-selection';

  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Welcome to NEST'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'How would you like to use NEST?',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 24),
            _RoleCard(
              icon: Icons.shopping_bag_outlined,
              title: 'Customer',
              description: 'Book transportation and pay securely through escrow.',
              onTap: () {
                Navigator.pushNamed(context, LoginScreen.customerRoute);
              },
            ),
            const SizedBox(height: 16),
            _RoleCard(
              icon: Icons.local_shipping_outlined,
              title: 'Driver',
              description:
                  'Accept delivery requests and receive guaranteed payments.',
              onTap: () {
                Navigator.pushNamed(context, LoginScreen.driverRoute);
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final VoidCallback onTap;

  const _RoleCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Ink(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: Theme.of(context).cardColor,
          border: Border.all(color: const Color(0xFF2A2F3A)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF1F232C),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, size: 28, color: Colors.white),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    description,
                    style: const TextStyle(
                      fontSize: 13,
                      color: NestStatusColors.mutedText,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: NestStatusColors.mutedText),
          ],
        ),
      ),
    );
  }
}

// 3. Authentication Screens
class LoginScreen extends StatefulWidget {
  static const customerRoute = '/login-customer';
  static const driverRoute = '/login-driver';

  final UserRole role;

  const LoginScreen({super.key, required this.role});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;
  String? _error;

  String get _roleLabel =>
      widget.role == UserRole.customer ? 'Customer' : 'Driver';

  Future<void> _handleLogin() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ApiClient.instance
          .login(_emailController.text.trim(), _passwordController.text);

      if (Session.instance.role == UserRole.driver) {
        Navigator.pushReplacementNamed(
            context, DriverDashboardScreen.routeName);
      } else {
        Navigator.pushReplacementNamed(
            context, CustomerHomeScreen.routeName);
      }
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login as $_roleLabel'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 12),
            Text(
              'Welcome back, $_roleLabel',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Password',
              ),
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: () {},
                child: const Text(
                  'Forgot password?',
                  style: TextStyle(color: NestStatusColors.mutedText),
                ),
              ),
            ),
            const SizedBox(height: 8),
            if (_error != null) ...[
              Text(
                _error!,
                style: const TextStyle(
                  color: NestStatusColors.error,
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 8),
            ],
            ElevatedButton(
              onPressed: _loading ? null : _handleLogin,
              child: _loading
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Login'),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  "Don't have an account?",
                  style: TextStyle(color: NestStatusColors.mutedText),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(
                      context,
                      widget.role == UserRole.customer
                          ? SignUpScreen.customerRoute
                          : SignUpScreen.driverRoute,
                    );
                  },
                  child: const Text('Sign up'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class SignUpScreen extends StatefulWidget {
  static const customerRoute = '/signup-customer';
  static const driverRoute = '/signup-driver';

  final UserRole role;

  const SignUpScreen({super.key, required this.role});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _walletController = TextEditingController();
  final _vehicleTypeController = TextEditingController();
  final _vehicleNumberController = TextEditingController();
  final _licenseController = TextEditingController();
  final _identityController = TextEditingController();

  bool _loading = false;
  String? _error;

  UserRole get _role => widget.role;

  String get _roleLabel =>
      _role == UserRole.customer ? 'Customer' : 'Driver';

  Future<void> _handleSignUp() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ApiClient.instance.register(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
        role: _role,
        walletAddress: _walletController.text.trim().isEmpty
            ? null
            : _walletController.text.trim(),
      );

      if (Session.instance.role == UserRole.driver) {
        Navigator.pushReplacementNamed(
            context, DriverDashboardScreen.routeName);
      } else {
        Navigator.pushReplacementNamed(
            context, CustomerHomeScreen.routeName);
      }
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDriver = _role == UserRole.driver;

    return Scaffold(
      appBar: AppBar(
        title: Text('Create $_roleLabel account'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 12),
            Text(
              'Join NEST as $_roleLabel',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Full name'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(labelText: 'Phone number'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _walletController,
              decoration:
                  const InputDecoration(labelText: 'Wallet address (optional)'),
            ),
            if (isDriver) ...[
              const SizedBox(height: 24),
              const Text(
                'Driver details',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _vehicleTypeController,
                decoration: const InputDecoration(
                    labelText: 'Vehicle type (e.g., Bike, Van)'),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _vehicleNumberController,
                decoration:
                    const InputDecoration(labelText: 'Vehicle number'),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _licenseController,
                decoration: const InputDecoration(
                    labelText: 'Driver license verification (ID / number)'),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _identityController,
                decoration: const InputDecoration(
                    labelText: 'Identity verification (National ID / Passport)'),
              ),
            ],
            const SizedBox(height: 24),
            if (_error != null) ...[
              Text(
                _error!,
                style: const TextStyle(
                  color: NestStatusColors.error,
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 8),
            ],
            ElevatedButton(
              onPressed: _loading ? null : _handleSignUp,
              child: _loading
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Create account'),
            ),
          ],
        ),
      ),
    );
  }
}

// 4. Customer Home Dashboard
class CustomerHomeScreen extends StatelessWidget {
  static const routeName = '/customer-home';

  const CustomerHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('NEST – Customer'),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle_outlined),
            onPressed: () {
              Navigator.pushNamed(context, ProfileScreen.customerRoute);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Quick booking',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            _BookingCard(),
            const SizedBox(height: 24),
            const Text(
              'Active deliveries',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            _ActiveDeliveryList(),
            const SizedBox(height: 24),
            const Text(
              'Order history',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            _OrderHistoryList(),
          ],
        ),
      ),
    );
  }
}

class _BookingCard extends StatefulWidget {
  @override
  State<_BookingCard> createState() => _BookingCardState();
}

class _BookingCardState extends State<_BookingCard> {
  final pickupController = TextEditingController();
  final dropOffController = TextEditingController();
  final packageCategoryController = TextEditingController();
  final packageWeightController = TextEditingController();
  final preferredTimeController = TextEditingController();

  double? estimatedPrice;
  double? estimatedDistanceKm;

  @override
  void dispose() {
    pickupController.dispose();
    dropOffController.dispose();
    packageCategoryController.dispose();
    packageWeightController.dispose();
    preferredTimeController.dispose();
    super.dispose();
  }

  void _calculateEstimate() {
    // Mocked estimation logic
    setState(() {
      estimatedDistanceKm = 8.2;
      estimatedPrice = 12.50;
    });
  }

  void _proceedToEscrow(BuildContext context) {
    Navigator.pushNamed(context, EscrowStatusScreen.routeName);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF2A2F3A)),
      ),
      child: Column(
        children: [
          TextField(
            controller: pickupController,
            decoration: const InputDecoration(
              labelText: 'Pickup location',
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: dropOffController,
            decoration: const InputDecoration(
              labelText: 'Delivery destination',
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: packageCategoryController,
            decoration: const InputDecoration(
              labelText: 'Package category',
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: packageWeightController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Package weight (kg)',
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: preferredTimeController,
            decoration: const InputDecoration(
              labelText: 'Preferred delivery time',
            ),
          ),
          const SizedBox(height: 16),
          if (estimatedPrice != null && estimatedDistanceKm != null)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF1F232C),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Estimated distance',
                        style: TextStyle(
                          fontSize: 12,
                          color: NestStatusColors.mutedText,
                        ),
                      ),
                      Text(
                        '${estimatedDistanceKm!.toStringAsFixed(1)} km',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text(
                        'Estimated cost',
                        style: TextStyle(
                          fontSize: 12,
                          color: NestStatusColors.mutedText,
                        ),
                      ),
                      Text(
                        '\$${estimatedPrice!.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: _calculateEstimate,
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFF2A2F3A)),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text('Calculate price'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => _proceedToEscrow(context),
                  child: const Text('Book & pay to escrow'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActiveDeliveryList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final items = [
      {
        'route': 'Downtown → Airport',
        'status': 'Driver Assigned',
        'badgeColor': NestStatusColors.warning,
      },
      {
        'route': 'Warehouse → Client HQ',
        'status': 'In Transit',
        'badgeColor': NestStatusColors.warning,
      },
    ];

    return Column(
      children: items
          .map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: _StatusCard(
                title: item['route'] as String,
                status: item['status'] as String,
                color: item['badgeColor'] as Color,
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    TripTrackingScreen.customerRoute,
                  );
                },
              ),
            ),
          )
          .toList(),
    );
  }
}

class _OrderHistoryList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final history = [
      {
        'date': 'Mar 07',
        'driver': 'Alex Johnson',
        'price': '\$18.20',
        'status': 'Delivery Completed',
      },
      {
        'date': 'Mar 01',
        'driver': 'Sara Lee',
        'price': '\$12.80',
        'status': 'Delivery Completed',
      },
    ];

    return Column(
      children: history
          .map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF2A2F3A)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item['date'] as String,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item['driver'] as String,
                          style: const TextStyle(
                            fontSize: 13,
                            color: NestStatusColors.mutedText,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          item['price'] as String,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Delivery Completed',
                          style: TextStyle(
                            fontSize: 12,
                            color: NestStatusColors.success,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}

class _StatusCard extends StatelessWidget {
  final String title;
  final String status;
  final Color color;
  final VoidCallback? onTap;

  const _StatusCard({
    required this.title,
    required this.status,
    required this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final card = Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF2A2F3A)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text(
              status,
              style: TextStyle(
                fontSize: 11,
                color: color,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );

    if (onTap == null) return card;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: card,
    );
  }
}

// 5. Driver Dashboard
class DriverDashboardScreen extends StatelessWidget {
  static const routeName = '/driver-dashboard';

  const DriverDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool driverOnline = true;

    return Scaffold(
      appBar: AppBar(
        title: const Text('NEST – Driver'),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle_outlined),
            onPressed: () {
              Navigator.pushNamed(context, ProfileScreen.driverRoute);
            },
          ),
        ],
      ),
      body: StatefulBuilder(
        builder: (context, setState) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF2A2F3A)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Status',
                            style: TextStyle(
                              fontSize: 13,
                              color: NestStatusColors.mutedText,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            driverOnline ? 'Online' : 'Offline',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: driverOnline
                                  ? NestStatusColors.success
                                  : NestStatusColors.mutedText,
                            ),
                          ),
                        ],
                      ),
                      Switch(
                        value: driverOnline,
                        activeColor: NestStatusColors.success,
                        onChanged: (value) {
                          setState(() {
                            driverOnline = value;
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Incoming trip requests',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                _IncomingTripCard(
                  pickup: 'Market Street',
                  dropOff: 'City Center Mall',
                  distance: '4.5 km',
                  earnings: '\$9.80',
                  eta: '18 min',
                ),
                const SizedBox(height: 24),
                const Text(
                  'Active trip',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                _ActiveTripCard(),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _IncomingTripCard extends StatelessWidget {
  final String pickup;
  final String dropOff;
  final String distance;
  final String earnings;
  final String eta;

  const _IncomingTripCard({
    required this.pickup,
    required this.dropOff,
    required this.distance,
    required this.earnings,
    required this.eta,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF2A2F3A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.my_location_outlined,
                  size: 18, color: NestStatusColors.mutedText),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  pickup,
                  style: const TextStyle(fontSize: 13),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.location_on_outlined,
                  size: 18, color: NestStatusColors.mutedText),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  dropOff,
                  style: const TextStyle(fontSize: 13),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.route,
                      size: 16, color: NestStatusColors.mutedText),
                  const SizedBox(width: 4),
                  Text(
                    distance,
                    style: const TextStyle(
                      fontSize: 12,
                      color: NestStatusColors.mutedText,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  const Icon(Icons.access_time,
                      size: 16, color: NestStatusColors.mutedText),
                  const SizedBox(width: 4),
                  Text(
                    eta,
                    style: const TextStyle(
                      fontSize: 12,
                      color: NestStatusColors.mutedText,
                    ),
                  ),
                ],
              ),
              Text(
                earnings,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {},
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFF2A2F3A)),
                    foregroundColor: NestStatusColors.mutedText,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text('Decline'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamed(
                        context, TripTrackingScreen.driverRoute);
                  },
                  child: const Text('Accept'),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}

class _ActiveTripCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final steps = [
      'Heading to pickup',
      'Package picked up',
      'In transit',
      'Delivery completed',
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF2A2F3A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Airport – Client HQ',
            style: TextStyle(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 10),
          Column(
            children: List.generate(steps.length, (index) {
              final isCurrent = index == 1;
              final isCompleted = index < 1;

              Color dotColor;
              if (isCompleted) {
                dotColor = NestStatusColors.success;
              } else if (isCurrent) {
                dotColor = NestStatusColors.warning;
              } else {
                dotColor = NestStatusColors.mutedText;
              }

              return Row(
                children: [
                  Column(
                    children: [
                      Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: dotColor,
                        ),
                      ),
                      if (index != steps.length - 1)
                        Container(
                          width: 2,
                          height: 18,
                          color: const Color(0xFF2A2F3A),
                        ),
                    ],
                  ),
                  const SizedBox(width: 10),
                  Text(
                    steps[index],
                    style: TextStyle(
                      fontSize: 13,
                      color: isCompleted || isCurrent
                          ? Colors.white
                          : NestStatusColors.mutedText,
                    ),
                  ),
                ],
              );
            }),
          ),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: () {},
            child: const Text('Open navigation'),
          ),
        ],
      ),
    );
  }
}

// 7. Trip Tracking Screen
class TripTrackingScreen extends StatelessWidget {
  static const customerRoute = '/trip-tracking-customer';
  static const driverRoute = '/trip-tracking-driver';

  final UserRole role;

  const TripTrackingScreen({super.key, required this.role});

  @override
  Widget build(BuildContext context) {
    final isDriver = role == UserRole.driver;
    final steps = [
      'Request created',
      'Driver assigned',
      'Driver en route',
      'Package picked up',
      'Delivery in progress',
      'Delivered',
    ];

    final currentStepIndex = 4;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Delivery tracking'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: const Color(0xFF171A21),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFF2A2F3A)),
              ),
              child: Stack(
                children: [
                  Positioned.fill(
                    child: CustomPaint(
                      painter: _MapMockPainter(),
                    ),
                  ),
                  const Positioned(
                    left: 20,
                    top: 40,
                    child: _MapMarker(
                      icon: Icons.my_location,
                      color: Colors.white,
                      label: 'Pickup',
                    ),
                  ),
                  const Positioned(
                    right: 20,
                    bottom: 40,
                    child: _MapMarker(
                      icon: Icons.flag,
                      color: NestStatusColors.success,
                      label: 'Destination',
                    ),
                  ),
                  const Positioned(
                    left: 120,
                    top: 100,
                    child: _MapMarker(
                      icon: Icons.local_shipping,
                      color: NestStatusColors.warning,
                      label: 'Driver',
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Delivery progress',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            Column(
              children: List.generate(steps.length, (index) {
                final isCompleted = index < currentStepIndex;
                final isCurrent = index == currentStepIndex;

                Color dotColor;
                if (isCompleted) {
                  dotColor = NestStatusColors.success;
                } else if (isCurrent) {
                  dotColor = NestStatusColors.warning;
                } else {
                  dotColor = NestStatusColors.mutedText;
                }

                return Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Column(
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: dotColor,
                          ),
                        ),
                        if (index != steps.length - 1)
                          Container(
                            width: 2,
                            height: 24,
                            color: const Color(0xFF2A2F3A),
                          ),
                      ],
                    ),
                    const SizedBox(width: 10),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Text(
                        steps[index],
                        style: TextStyle(
                          fontSize: 13,
                          color: isCompleted || isCurrent
                              ? Colors.white
                              : NestStatusColors.mutedText,
                        ),
                      ),
                    ),
                  ],
                );
              }),
            ),
            const SizedBox(height: 20),
            const Text(
              'Driver information',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF2A2F3A)),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 20,
                    backgroundColor: Color(0xFF1F232C),
                    child: Icon(Icons.person, color: Colors.white),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Alex Johnson',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'White Van • AB-1234',
                          style: TextStyle(
                            fontSize: 13,
                            color: NestStatusColors.mutedText,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.call),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MapMockPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF222632)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final path = Path()
      ..moveTo(20, size.height - 40)
      ..quadraticBezierTo(
        size.width * 0.3,
        size.height * 0.2,
        size.width * 0.6,
        size.height * 0.7,
      )
      ..quadraticBezierTo(
        size.width * 0.8,
        size.height * 0.9,
        size.width - 20,
        40,
      );

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _MapMarker extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String label;

  const _MapMarker({
    required this.icon,
    required this.color,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            size: 18,
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: NestStatusColors.mutedText,
          ),
        ),
      ],
    );
  }
}

// 8. Escrow Payment Status Screen
class EscrowStatusScreen extends StatelessWidget {
  static const routeName = '/escrow-status';

  const EscrowStatusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final steps = [
      'Payment locked',
      'Driver accepted order',
      'Delivery completed',
      'Delivery verification',
      'Payment released',
    ];

    final currentStepIndex = 1;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Escrow payment'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFF2A2F3A)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Order ID',
                    style: TextStyle(
                      fontSize: 12,
                      color: NestStatusColors.mutedText,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    '#NEST-2026-1042',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Total amount',
                    style: TextStyle(
                      fontSize: 12,
                      color: NestStatusColors.mutedText,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    '\$24.60',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Escrow status',
                    style: TextStyle(
                      fontSize: 12,
                      color: NestStatusColors.mutedText,
                    ),
                  ),
                  SizedBox(height: 4),
                  _EscrowStatusBadge(
                    status: 'Payment locked',
                    color: NestStatusColors.warning,
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Blockchain transaction confirmation',
                    style: TextStyle(
                      fontSize: 12,
                      color: NestStatusColors.mutedText,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    '0xA9c1...3F92',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Payment timeline',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: steps.length,
                itemBuilder: (context, index) {
                  final isCompleted = index < currentStepIndex;
                  final isCurrent = index == currentStepIndex;

                  Color dotColor;
                  if (isCompleted) {
                    dotColor = NestStatusColors.success;
                  } else if (isCurrent) {
                    dotColor = NestStatusColors.warning;
                  } else {
                    dotColor = NestStatusColors.mutedText;
                  }

                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        children: [
                          Container(
                            width: 10,
                            height: 10,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: dotColor,
                            ),
                          ),
                          if (index != steps.length - 1)
                            Container(
                              width: 2,
                              height: 24,
                              color: const Color(0xFF2A2F3A),
                            ),
                        ],
                      ),
                      const SizedBox(width: 10),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8.0),
                        child: Text(
                          steps[index],
                          style: TextStyle(
                            fontSize: 13,
                            color: isCompleted || isCurrent
                                ? Colors.white
                                : NestStatusColors.mutedText,
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EscrowStatusBadge extends StatelessWidget {
  final String status;
  final Color color;

  const _EscrowStatusBadge({
    required this.status,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        status,
        style: TextStyle(
          fontSize: 11,
          color: color,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

// 9. Delivery Confirmation Screen
class DeliveryConfirmationScreen extends StatelessWidget {
  static const routeName = '/delivery-confirmation';

  const DeliveryConfirmationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Confirm delivery'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFF2A2F3A)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Review your delivery',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Pickup: Warehouse 12',
                    style: TextStyle(fontSize: 13),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Destination: Client HQ, Downtown',
                    style: TextStyle(fontSize: 13),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Driver: Alex Johnson • Van AB-1234',
                    style: TextStyle(
                      fontSize: 13,
                      color: NestStatusColors.mutedText,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Was the package delivered correctly and in good condition?',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    backgroundColor: const Color(0xFF171A21),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                    title: const Text('Payment released'),
                    content: const Text(
                      'Thank you. The escrow smart contract has released the payment to the driver.',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Close'),
                      ),
                    ],
                  ),
                );
              },
              icon: const Icon(Icons.check_circle_outline),
              label: const Text('Confirm delivery'),
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    backgroundColor: const Color(0xFF171A21),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                    title: const Text('Report an issue'),
                    content: const Text(
                      'A dispute has been opened. Our team will review the case before funds are released.',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Close'),
                      ),
                    ],
                  ),
                );
              },
              icon: const Icon(
                Icons.report_gmailerrorred_outlined,
                color: NestStatusColors.error,
              ),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: NestStatusColors.error),
                foregroundColor: NestStatusColors.error,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              label: const Text('Report issue'),
            ),
          ],
        ),
      ),
    );
  }
}

// 10. Profile and Account Screen
class ProfileScreen extends StatelessWidget {
  static const customerRoute = '/profile-customer';
  static const driverRoute = '/profile-driver';

  final UserRole role;

  const ProfileScreen({super.key, required this.role});

  String get _roleLabel => role == UserRole.customer ? 'Customer' : 'Driver';

  @override
  Widget build(BuildContext context) {
    final isDriver = role == UserRole.driver;

    return Scaffold(
      appBar: AppBar(
        title: Text('$_roleLabel account'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const CircleAvatar(
                  radius: 26,
                  backgroundColor: Color(0xFF1F232C),
                  child: Icon(Icons.person, color: Colors.white),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Taylor Smith',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      _roleLabel,
                      style: const TextStyle(
                        fontSize: 13,
                        color: NestStatusColors.mutedText,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Text(
              'Account',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            _ProfileItem(
              icon: Icons.person_outline,
              title: 'Edit profile',
              subtitle: 'Name, contact details',
              onTap: () {},
            ),
            if (!isDriver)
              _ProfileItem(
                icon: Icons.history,
                title: 'Order history',
                subtitle: 'View all past deliveries',
                onTap: () {},
              ),
            if (!isDriver)
              _ProfileItem(
                icon: Icons.payment_outlined,
                title: 'Payment methods',
                subtitle: 'Manage cards and wallets',
                onTap: () {},
              ),
            if (isDriver) ...[
              _ProfileItem(
                icon: Icons.star_outline,
                title: 'Driver rating',
                subtitle: '4.8 • 120 reviews',
                onTap: () {},
              ),
              _ProfileItem(
                icon: Icons.local_shipping_outlined,
                title: 'Total deliveries',
                subtitle: '245 completed',
                onTap: () {},
              ),
              _ProfileItem(
                icon: Icons.account_balance_wallet_outlined,
                title: 'Total earnings',
                subtitle: '\$12,430.00',
                onTap: () {},
              ),
              _ProfileItem(
                icon: Icons.directions_car_filled_outlined,
                title: 'Vehicle details',
                subtitle: 'White Van • AB-1234',
                onTap: () {},
              ),
            ],
            _ProfileItem(
              icon: Icons.support_agent_outlined,
              title: 'Support center',
              subtitle: 'Get help & FAQs',
              onTap: () {},
            ),
            const SizedBox(height: 24),
            TextButton.icon(
              onPressed: () {
                Navigator.pushNamedAndRemoveUntil(
                  context,
                  RoleSelectionScreen.routeName,
                  (route) => false,
                );
              },
              icon: const Icon(
                Icons.logout,
                color: NestStatusColors.mutedText,
              ),
              label: const Text(
                'Log out',
                style: TextStyle(color: NestStatusColors.mutedText),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _ProfileItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        margin: const EdgeInsets.only(bottom: 10),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF2A2F3A)),
        ),
        child: Row(
          children: [
            Icon(icon, color: NestStatusColors.mutedText),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: NestStatusColors.mutedText,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: NestStatusColors.mutedText),
          ],
        ),
      ),
    );
  }
}

