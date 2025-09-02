export const DEFAULT_C_CODE = `/*
 * Thread Weaver - Your C/pthreads Playground
 *
 * This is a simple example to get you started.
 * Select a piece of code and click 'Generate with AI' 
 * to get pthreads suggestions.
 */

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

#define NUM_THREADS 4

// A simple function for threads to execute
void *worker_function(void *thread_id) {
    long tid;
    tid = (long)thread_id;
    printf("Hello from thread #%ld!\\n", tid);
    // Simulate some work
    sleep(1);
    printf("Thread #%ld finished.\\n", tid);
    pthread_exit(NULL);
}

int main() {
    pthread_t threads[NUM_THREADS];
    int rc;
    long t;

    printf("Starting program...\\n");

    for(t = 0; t < NUM_THREADS; t++) {
        printf("Creating thread %ld\\n", t);
        rc = pthread_create(&threads[t], NULL, worker_function, (void *)t);
        if (rc) {
            printf("ERROR; return code from pthread_create() is %d\\n", rc);
            exit(-1);
        }
    }

    // Wait for all threads to complete
    for(t = 0; t < NUM_THREADS; t++) {
        pthread_join(threads[t], NULL);
    }

    printf("All threads completed. Exiting program.\\n");

    // To see an AI suggestion, try selecting the for loop above
    // and clicking "Generate with AI".

    pthread_exit(NULL);
}
`;
