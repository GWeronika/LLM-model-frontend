# LLM Fine tuning

Branch do fine-tuningu modeli dla kilku wybranch kategorii jako POC. 
Fine tuning w notatnikach google-colabatory pozwala na darmowe trenowanie na GPU google.
Darmowe obciążenie to około 4h obciążenia notatnika. Przy czym liczba ta się zmienia a zapis modelu trwa chwilę, więc bezpieczne jest ~3h uczenia.
---

## Użycie
- uzupełniamy pierwszę polę notatnika
- przetrenowany model jest zapisywany na konto na huggingface (max 100GB)
- tworzymy folder z plikiem modelu jako model.ggof i plikiem Modelfile
- komenda: ollama create <model_name> -f Modelfile
---

This project uses components from the Unsloth project, licensed under the Apache License 2.0.
