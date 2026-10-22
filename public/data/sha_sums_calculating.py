import os
import json
import hashlib

def calculate_sha256(file_path):
    """Вычисляет SHA-256 хеш файла"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        # Читаем файл блоками для экономии памяти
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def main(directory="."):
    """
    Ищет файлы с 'hsk' в названии и расширением .json,
    вычисляет их SHA-256 и сохраняет в sha_sums.json
    """
    # Собираем все файлы, соответствующие условию
    matching_files = []
    
    for filename in os.listdir(directory):
        # Проверяем наличие "crop" в имени и расширение .json
        if "hsk" in filename.lower() and filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            # Проверяем, что это файл, а не директория
            if os.path.isfile(file_path):
                matching_files.append(file_path)
    
    if not matching_files:
        print("Файлы, содержащие 'hsk' в названии с расширением .json, не найдены.")
        return
    
    # Вычисляем хеши для всех найденных файлов
    result = {}
    for file_path in sorted(matching_files):  # Сортируем для детерминированного порядка
        filename = os.path.basename(file_path)
        print(f"Обработка: {filename}")
        try:
            sha_sum = calculate_sha256(file_path)
            result[filename] = sha_sum
        except Exception as e:
            print(f"Ошибка при обработке {filename}: {e}")
    
    # Сохраняем результат в JSON
    output_file = "sha_sums.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\nГотово! Результат сохранён в {output_file}")
    print(f"Обработано файлов: {len(result)}")

if __name__ == "__main__":
    # Можно указать путь к каталогу как аргумент командной строки
    import sys
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        main()
