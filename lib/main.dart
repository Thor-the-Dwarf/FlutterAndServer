import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Add Code Entry'),
        ),
        body: Center(
          child: ElevatedButton(
            onPressed: addCodeEntry,
            child: Text('Add Code'),
          ),
        ),
      ),
    );
  }

  Future<void> addCodeEntry() async {
    const url = 'http://localhost:3000/codes';
    final newEntry = {
      'id': null,  // Die ID wird normalerweise vom Server generiert
      'code': '54321'
    };

    try {
      final postResponse = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(newEntry),
      );

      if (postResponse.statusCode == 201 || postResponse.statusCode == 200) {
        print('Eintrag hinzugefügt');
      } else {
        print('Fehler beim Hinzufügen des Eintrags: ${postResponse.statusCode}');
      }
    } catch (e) {
      print('Fehler: $e');
    }
  }
}
