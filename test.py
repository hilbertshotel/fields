import math

def add(x, y):
    return x + y

def sub(x, y):
    return x - y

def div(x, y):
    return x / y

def main():
    x = 5
    y = 7
    z = 54
    result = add(x, y) - sub(x, y) + z
    print(result)


main()
