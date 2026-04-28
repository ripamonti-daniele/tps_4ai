void main() throws InterruptedException {
//    ClasseContatore c1 = new ClasseContatore();
//    Thread t1 = new Thread(c1);
//    t1.setName("T1");
//    System.out.println(t1.getState());
//    t1.start();
//    Thread.sleep(10);
//    System.out.println(t1.getState());
//    Thread.sleep(2000);
//    System.out.println(t1.getState());

//    Sommatore s = new Sommatore();
//    Thread t2 = new Thread(s);
//    t2.setName("t2");
//    Thread t3 = new Thread(s);
//    t3.setName("t3");
//    t2.start();
//    t3.start();

    ClasseContatore c2 = new ClasseContatore();
    Thread t4 = new Thread(c2);
    t4.start();
    //Il main deve bloccare c2 dopo aver incrementato fino a 500 la variable z. z deve essere incrementata di 1 alla volta
    int z = 0;
    for (int k = 0; k <= 10000; k++) {
        z++;
        System.out.println(z);
        if (z == 1500) {
            t4.interrupt();
            System.out.println("t4 bloccato");
            break;
        }
    }
}
