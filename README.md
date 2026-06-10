# Parallel Prefix Sum (Scan) Implementation

This repository contains a C++ implementation of the Parallel Prefix Sum (Scan) algorithm, developed as part of the Parallel Systems course (EE382N/CS380P) at The University of Texas at Austin.

The project implements both sequential and parallel versions of the prefix sum algorithm, with support for customizable operators, synthetic workloads, and different synchronization primitives.

## Overview

Prefix sum (also known as scan) is a fundamental building block in parallel computing. Given an input array $[x_0, x_1, \dots, x_{n-1}]$ and a binary associative operator $\oplus$, the prefix sum produces an output array $[y_0, y_1, \dots, y_{n-1}]$ such that:
- Inclusive Scan: $y_i = x_0 \oplus x_1 \oplus \dots \oplus x_i$
- Exclusive Scan: $y_i = x_0 \oplus x_1 \oplus \dots \oplus x_{i-1}$ (with $y_0$ being the identity element)

This implementation primarily focuses on the **Blelloch (Work-Efficient) Parallel Scan** algorithm, which uses a two-phase approach (Up-Sweep and Down-Sweep) to achieve $O(n)$ work and $O(\log n)$ span.

## Features

- **Parallel Implementation:** Uses POSIX Threads (`pthreads`) for multi-threaded execution.
- **Blelloch Scan:** A work-efficient parallel algorithm that minimizes total operations.
- **Customizable Synchronization:** Supports both standard `pthread_barrier_t` and a custom spin-based barrier.
- **Performance Measurement:** Built-in high-resolution timers to measure execution time in microseconds.
- **Synthetic Workload:** A `loops` parameter allows simulating computationally expensive operators by repeating the operation multiple times.
- **Automated Testing:** Python scripts for generating inputs and benchmarking performance across different thread counts and workloads.

## Project Structure

- `src/`: C++ source and header files.
  - `main.cpp`: Entry point, handles thread orchestration and timing.
  - `prefix_sum.cpp`: Core implementation of the parallel and sequential scan algorithms.
  - `spin_barrier.cpp`: Implementation of the custom sense-reversing spin barrier.
  - `argparse.cpp`: Command-line argument parsing logic.
  - `io.cpp`: File I/O for reading input arrays and writing results.
  - `operators.cpp`: Definition of scan operators (e.g., addition).
- `tests/`: Sample input files (`1k.txt`, `8k.txt`, `16k.txt`, etc.).
- `bin/`: Compiled executable location.
- `Makefile`: Build configuration.
- `run_tests.py`: Benchmarking script.
- `generate_inputs.py`: Utility to create random input files.

## Getting Started

### Prerequisites

- A C++ compiler supporting C++17 (e.g., `g++`).
- `make` build utility.
- POSIX-compliant environment (for `pthreads`).

### Building

To compile the project, simply run:

```bash
make
```

This will generate the `prefix_scan` executable in the `bin/` directory.

### Usage

Run the executable with the following flags:

```bash
./bin/prefix_scan -i <input_file> -o <output_file> -n <num_threads> -l <num_loops> [-s]
```

**Arguments:**
- `-i, --in`: Path to the input file (text file with integer count followed by values).
- `-o, --out`: Path to save the output result.
- `-n, --n_threads`: Number of threads to use. Use `0` for the sequential implementation.
- `-l, --loops`: Number of times to repeat the operator (simulates workload).
- `-s, --spin`: (Optional) Use the custom spin barrier instead of the default `pthread_barrier`.

**Example:**
```bash
./bin/prefix_scan -i tests/1k.txt -o output.txt -n 4 -l 100
```

## Performance Evaluation

The provided `run_tests.py` script can be used to generate a performance report across various thread counts and workload intensities. It outputs a CSV-formatted table showing execution time in microseconds.

```bash
python3 run_tests.py
```

## Implementation Details

### Blelloch Scan Phases
1. **Up-Sweep (Reduce):** Computes partial sums and builds a tree structure in-place.
2. **Down-Sweep:** Uses the partial sums to compute the prefix sum values in $O(\log n)$ steps.

### Custom Spin Barrier
The spin barrier is implemented as a sense-reversing barrier to avoid the "one-shot" limitation of simple spinlocks and to reduce synchronization overhead in certain environments compared to mutex-based barriers.

---
*Developed for UT Austin CS380P/EE382N Parallel Systems.*
