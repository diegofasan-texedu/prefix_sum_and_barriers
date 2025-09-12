#include "prefix_sum.h"
#include "helpers.h"
#include <pthread.h>
#include <string> 
#include <cmath>   // For log2
#include <stdio.h> // For printf

void* compute_prefix_sum(void *a)
{
    prefix_sum_args_t *prefix_sum_args = (prefix_sum_args_t *)a;

    // 1. Setup & Local Variables
    int t_id = prefix_sum_args->t_id;
    int n_threads = prefix_sum_args->n_threads;
    int n_vals = prefix_sum_args->n_vals;
    // int* input_vals = prefix_sum_args->input_vals;
    int* output_vals = prefix_sum_args->output_vals;
    auto op = prefix_sum_args->op;
    int n_loops = prefix_sum_args->n_loops;
    pthread_barrier_t* barrier = prefix_sum_args->barrier;

    // 2. Initial Data Copy
    // Each thread copies its assigned contiguous chunk of data. This is essential
    // because we need the original input values for the final step.
    // int chunk_size = n_vals / n_threads;
    // int start_idx = t_id * chunk_size;
    // int end_idx = start_idx + chunk_size;

    // if (t_id == 0) printf("[LOG] Checkpoint 1: Starting initial data copy.\n");
    // for (int i = start_idx; i < end_idx; ++i) {
    //     output_vals[i] = input_vals[i];
    // }
    // pthread_barrier_wait(barrier);

    if (t_id == 0) printf("[LOG] Checkpoint 2: Starting Up-Sweep phase.\n");

    // 3. Up-Sweep (Reduce Phase)
    // This phase builds a tree of partial sums in the output_vals array.
    for (int d = 0; d < log2(n_vals); ++d) {
        int stride = 1 << d; // stride = 2^d
        int num_updates = n_vals / (2 * stride); // Total work items for this step

        // Distribute the actual work items (updates) among threads. This avoids
        // "work inflation" where threads loop without doing useful work.
        for (int i = t_id; i < num_updates; i += n_threads) {
            int k = (i + 1) * (2 * stride) - 1;
            output_vals[k] = op(output_vals[k - stride], output_vals[k], n_loops);
        }
        pthread_barrier_wait(barrier);
    }

    if (t_id == 0) printf("[LOG] Checkpoint 3: Starting Down-Sweep phase.\n");

    // 4. Down-Sweep Phase
    // This phase builds the exclusive scan result.
    // The last element is cleared (set to the identity element, 0 for addition).
    if (t_id == n_threads - 1) { // The last thread handles the last element
        if (n_vals > 0) {
            output_vals[n_vals - 1] = 0;
        }
    }
    pthread_barrier_wait(barrier);

    // This loop goes from the top of the tree back down.
    for (int d = log2(n_vals) - 1; d >= 0; --d) {
        int stride = 1 << d;
        int num_updates = n_vals / (2 * stride); // Total work items for this step

        for (int i = t_id; i < num_updates; i += n_threads) {
            int k = (i + 1) * (2 * stride) - 1;
            int temp = output_vals[k - stride];
            output_vals[k - stride] = output_vals[k];
            output_vals[k] = op(temp, output_vals[k], n_loops);
        }
        pthread_barrier_wait(barrier);
    }

    if (t_id == 0) printf("[LOG] Checkpoint 4: Starting final inclusive pass.\n");

    // 5. Final Pass for Inclusive Scan
    // Convert the exclusive scan to an inclusive scan by adding the original input.
    // for (int i = start_idx; i < end_idx; ++i) {
    //     output_vals[i] = op(output_vals[i], input_vals[i], n_loops);
    // }

    if (t_id == 0) printf("[LOG] Checkpoint 5: Computation complete.\n");

    return NULL;
 }
