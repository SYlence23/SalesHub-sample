import sys
from PIL import Image

def remove_white(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    
    # Define how strict we are about white (e.g., > 240)
    for item in datas:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            # Change all white-ish pixels to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_bg.py input output")
    else:
        remove_white(sys.argv[1], sys.argv[2])
        print("Background removed successfully!")
