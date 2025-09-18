import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Alert } from 'react-native';
import Constants from 'expo-constants';
import { initNDK, publishNote, subscribeToFeed } from './lib/ndk';

export default function App() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Not connected');
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        await initNDK();
        setStatus('Connected to relays');
        // example: subscribe to feed (public notes)
        const sub = subscribeToFeed([], (ev) => {
          setFeed(prev => [ev, ...prev].slice(0, 50));
        });
        return () => sub?.close();
      } catch (e) {
        setStatus('NDK init error: ' + String(e));
      }
    })();
  }, []);

  async function onPublish() {
    try {
      // For testing only: read privkey from app constants (DO NOT USE IN PROD)
      const priv = Constants.manifest?.extra?.TEST_PRIVKEY || '';
      if (!priv) {
        Alert.alert('Missing privkey', 'Set TEST_PRIVKEY in app.json -> expo.extra or use a secure wallet.');
        return;
      }
      const ev = await publishNote(text, priv);
      setStatus('Published: ' + ev.id);
      setText('');
    } catch (err) {
      setStatus('Publish error: ' + String(err));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nostr Substack (Expo Demo)</Text>
      <Text style={styles.status}>{status}</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Write a chapter / note..."
        value={text}
        onChangeText={setText}
      />
      <Button title="Publish note (kind 1)" onPress={onPublish} />
      <Text style={styles.subtitle}>Feed (latest notes)</Text>
      <ScrollView style={styles.feed}>
        {feed.map((ev, i) => (
          <View key={i} style={styles.note}>
            <Text style={styles.noteText}>{ev.content?.slice(0, 300) || '[no content]'}</Text>
            <Text style={styles.noteMeta}>id: {ev.id}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, paddingTop: 48 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  status: { fontSize: 12, color: '#666', marginBottom: 8 },
  input: { minHeight: 100, borderColor: '#ddd', borderWidth: 1, padding: 8, marginBottom: 8, borderRadius: 6 },
  subtitle: { marginTop: 12, fontWeight: '600' },
  feed: { marginTop: 8 },
  note: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  noteText: { marginBottom: 6 },
  noteMeta: { fontSize: 11, color: '#888' }
});
