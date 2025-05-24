package org.zhj.devdeck.utils;

import java.util.Random;

public class AbstractNameGenerator {
    // 抽象词库（可自行扩展）
    private static final String[] PREFIXES = {"Cyber", "Neo", "Quantum", "Hyper", "Meta", "Nano", "Echo", "Zen", "Void", "Xeno"};
    private static final String[] MIDDLES = {"flux", "sphere", "grid", "node", "synth", "core", "wave", "phase", "loop", "echo"};
    private static final String[] SUFFIXES = {"01", "X", "π", "Ω", "∞", "∆", "//", "α", "β", "γ"};

    private final Random random = new Random();

    public String generate() {
        return switch (random.nextInt(3)) { // 三种生成模式
            case 0 -> prefixPattern();
            case 1 -> compoundPattern();
            default -> hybridPattern();
        };
    }

    // 模式1：前缀+中间词
    private String prefixPattern() {
        return randomElement(PREFIXES) +
               randomElement(MIDDLES).toLowerCase() +
               (random.nextBoolean() ? randomElement(SUFFIXES) : "");
    }

    // 模式2：合成词组合
    private String compoundPattern() {
        return randomElement(PREFIXES).substring(0, 2) +
               randomElement(MIDDLES).substring(0, 3) +
               "-" +
               randomElement(SUFFIXES);
    }

    // 模式3：混合模式
    private String hybridPattern() {
        return randomElement(PREFIXES) +
               String.valueOf((char)(random.nextInt(26) + 'A')) +
               randomElement(MIDDLES).substring(1) +
               (random.nextInt(1000) + 10);
    }

    private String randomElement(String[] array) {
        return array[random.nextInt(array.length)];
    }
    }